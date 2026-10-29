"""Bayt AI judge: video -> signed report.json + annotated.mp4.

Games (config "game"): football / basketball / volleyball score when the ball sits in a zone;
al-karabi eliminates a player whose feet leave the arena; al-ghomaidah scores a tag when a
seeker touches an opponent. Placeholder heuristics until the MediaPipe pipeline replaces them.

CLI:  python judge.py --input samples/demo.mp4 --config match.json --out outputs/demo [--preview]
Live: python judge.py --live [--input 0] --config match.json --out outputs/live
      (webcam; stdin takes pause / resume / seeker A|B / stop; stdout is one JSON line per tick or event)
Lib:  from judge import run_judge; run_judge(input, config_dict, out)
"""
import argparse
import base64
import json
import math
import os
import shutil
import subprocess
import sys
import threading
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np

from report import assert_ints, sign

HERE = Path(__file__).resolve().parent
MODEL_PATH = HERE / "yolov8n.pt"
GREY = (150, 150, 150)

JUDGE_DEFAULTS = {
    "goal_zones": [
        {"name": "left goal", "defending": "A", "rect": [0.0, 0.25, 0.12, 0.85]},
        {"name": "right goal", "defending": "B", "rect": [0.88, 0.25, 1.0, 0.85]},
    ],
    "ball_hsv_lower": [5, 120, 120],
    "ball_hsv_upper": [25, 255, 255],
    "frame_skip": 3,
    "width": 640,
    "possession_radius": 0.6,
    "goal_min_frames": 2,
    "goal_cooldown_s": 3,
    "review_threshold": 70,
    "ball_min_conf": 0.15,
    "arena": [0.1, 0.1, 0.9, 0.97],
    "out_min_frames": 3,
    "seeker": "A",
    "tag_radius": 0.45,
    "tag_min_frames": 2,
    "tag_cooldown_s": 3,
}

# Per game: event type, overlay word, and the judge defaults that differ from football.
# Zones use "defending" (the other team scores) or "award": "last-touch" (the last holder's team scores).
GAMES = {
    "football": {"event": "goal", "word": "GOAL!", "judge": {}},
    "basketball": {"event": "basket", "word": "BASKET!", "judge": {
        "goal_zones": [{"name": "hoop", "award": "last-touch", "rect": [0.4, 0.05, 0.6, 0.3]}],
        "goal_cooldown_s": 2}},
    "volleyball": {"event": "point", "word": "POINT!", "judge": {
        "goal_zones": [{"name": "left court", "defending": "A", "rect": [0.0, 0.7, 0.5, 1.0]},
                       {"name": "right court", "defending": "B", "rect": [0.5, 0.7, 1.0, 1.0]}],
        "goal_min_frames": 2, "goal_cooldown_s": 4}},
    "al-karabi": {"event": "elimination", "word": "OUT!", "judge": {}},
    "al-ghomaidah": {"event": "tag", "word": "TAG!", "judge": {}},
}
BALL_GAMES = {"football", "basketball", "volleyball"}


class JudgeError(Exception):
    """User-facing error with a clear message."""


# ---------------------------------------------------------------- config

def load_config(path):
    try:
        with open(path, encoding="utf-8") as f:
            cfg = json.load(f)
    except FileNotFoundError:
        raise JudgeError(f"Config file not found: {path}")
    except json.JSONDecodeError as e:
        raise JudgeError(f"Config is not valid JSON ({path}): {e}")
    return normalise_config(cfg)


def normalise_config(cfg):
    if not isinstance(cfg, dict):
        raise JudgeError("Config must be a JSON object.")
    teams = cfg.get("teams")
    if not isinstance(teams, list) or len(teams) != 2 or not all(
        isinstance(t, dict) and {"id", "name", "color"} <= t.keys() for t in teams
    ):
        raise JudgeError('Config needs "teams": exactly 2 objects with id, name, color.')
    for t in teams:
        hex_to_bgr(t["color"])  # validates
    cfg = dict(cfg)
    cfg.setdefault("game", "football")
    if cfg["game"] not in GAMES:
        raise JudgeError(f"Unknown game {cfg['game']!r}. Use one of: {', '.join(GAMES)}.")
    cfg["judge"] = {**JUDGE_DEFAULTS, **GAMES[cfg["game"]]["judge"], **(cfg.get("judge") or {})}
    ids = {t["id"] for t in teams}
    for z in cfg["judge"]["goal_zones"]:
        if (z.get("defending") not in ids and z.get("award") != "last-touch") or len(z.get("rect", [])) != 4:
            raise JudgeError(f"Bad zone {z!r}: needs 'defending' (a team id) or 'award': 'last-touch', "
                             "and rect [x0,y0,x1,y1].")
    if cfg["judge"]["seeker"] not in ids:
        raise JudgeError("judge.seeker must be a team id.")
    cfg.setdefault("players", [])
    cfg.setdefault("rules", {})
    return cfg


def hex_to_bgr(h):
    s = str(h).lstrip("#")
    if len(s) != 6:
        raise JudgeError(f"Team colour must be #rrggbb, got {h!r}")
    try:
        r, g, b = (int(s[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        raise JudgeError(f"Team colour must be #rrggbb, got {h!r}")
    return (b, g, r)


def bgr_to_hsv(bgr):
    return [int(x) for x in cv2.cvtColor(np.uint8([[bgr]]), cv2.COLOR_BGR2HSV)[0, 0]]


# ---------------------------------------------------------------- vision helpers

def open_video(path):
    if not Path(path).is_file():
        raise JudgeError(f"Input video not found: {path}")
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise JudgeError(f"OpenCV could not open the video: {path} (unsupported codec or corrupt file?)")
    ok, frame = cap.read()
    if not ok or frame is None:
        cap.release()
        raise JudgeError(f"The video has no readable frames: {path}")
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or math.isnan(fps) or fps <= 0:
        fps = 30.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    return cap, frame, fps, total


def open_camera(src):
    """Live source: a camera index like "0", or a file path for testing."""
    s = str(src)
    if not s.isdigit():
        return open_video(s)
    cap = cv2.VideoCapture(int(s), cv2.CAP_DSHOW) if os.name == "nt" else cv2.VideoCapture(int(s))
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # always the newest frame, never a backlog
    ok, frame = cap.read() if cap.isOpened() else (False, None)
    if not ok or frame is None:
        cap.release()
        raise JudgeError(f"I couldn't open camera {s}. Is another app using it?")
    return cap, frame, 30.0, 0


def read_commands(ctl, j, team_ids):
    """Live mode: one command per stdin line. End of input (the server went away) also stops the judge."""
    for line in sys.stdin:
        parts = line.split()
        if not parts:
            continue
        if parts[0] == "pause":
            ctl["paused"] = True
        elif parts[0] == "resume":
            ctl["paused"] = False
        elif parts[0] == "seeker" and len(parts) > 1 and parts[1] in team_ids:
            j["seeker"] = parts[1]
        elif parts[0] == "stop":
            break
    ctl["stop"] = True


def emit(obj):
    print(json.dumps(obj), flush=True)


def jpeg_b64(img):
    return base64.b64encode(cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 60])[1]).decode("ascii")


def resize(frame, width):
    h, w = frame.shape[:2]
    return cv2.resize(frame, (width, max(1, round(h * width / w))), interpolation=cv2.INTER_AREA)


def ball_candidates(frame, lower, upper):
    """HSV mask -> list of (area, (x0,y0,x1,y1)) for roughly round blobs of a sane size."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array(lower, np.uint8), np.array(upper, np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    max_area = frame.shape[0] * frame.shape[1] * 0.02
    out = []
    for c in contours:
        area = cv2.contourArea(c)
        if area < 12 or area > max_area:
            continue
        per = cv2.arcLength(c, True)
        if per <= 0 or 4 * math.pi * area / (per * per) < 0.5:
            continue
        x, y, w, h = cv2.boundingRect(c)
        if max(w, h) > 2.2 * min(w, h):
            continue
        out.append((area, (x, y, x + w, y + h)))
    return sorted(out, reverse=True)


def torso_hsv(frame, box):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    crop = frame[int(y0 + 0.2 * h):int(y0 + 0.5 * h), int(x0 + 0.25 * w):int(x0 + 0.75 * w)]
    if crop.size == 0:
        return None
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV).reshape(-1, 3).astype(np.float64)
    s, v = float(np.median(hsv[:, 1])), float(np.median(hsv[:, 2]))
    # circular mean of hue (OpenCV hue is 0..179), weighted by saturation so red (0/179) works
    ang = hsv[:, 0] * (2 * math.pi / 180)
    wts = hsv[:, 1] + 1e-6
    hue = (math.atan2((np.sin(ang) * wts).sum(), (np.cos(ang) * wts).sum()) * 180 / (2 * math.pi)) % 180
    return hue, s, v


def colour_distance(sample, team_hsv):
    h, s, v = sample
    th, ts, tv = team_hsv
    if ts < 60:  # white / black / grey kit: judge by brightness, penalise colourful shirts
        return abs(v - tv) / 255 + max(0.0, s - 60) / 255
    dh = abs(h - th)
    d = min(dh, 180 - dh) / 90 + 0.2 * abs(v - tv) / 255
    if s < 60:  # washed-out crop cannot match a saturated kit
        d += 0.6
    return d


def classify_team(frame, box, teams_hsv):
    sample = torso_hsv(frame, box)
    if sample is None:
        return None
    best_id, best_d = None, 9.0
    for tid, thsv in teams_hsv.items():
        d = colour_distance(sample, thsv)
        if d < best_d:
            best_id, best_d = tid, d
    return best_id if best_d <= 0.5 else None


def majority(votes):
    if not votes:
        return None
    team, _ = votes.most_common(1)[0]
    return team


# ---------------------------------------------------------------- drawing

def put_label(img, text, org, colour, scale=0.45, thick=1):
    (tw, th), base = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)
    x, y = org
    x = max(0, min(x, img.shape[1] - tw - 4))
    y = max(th + 4, y)
    cv2.rectangle(img, (x, y - th - 4), (x + tw + 4, y + base - 2), colour, -1)
    cv2.putText(img, text, (x + 2, y - 2), cv2.FONT_HERSHEY_SIMPLEX, scale, (255, 255, 255), thick, cv2.LINE_AA)


def draw_zones(img, zones, team_names):
    H, W = img.shape[:2]
    for z in zones:
        x0, y0, x1, y1 = z["rect"]
        p0, p1 = (int(x0 * W), int(y0 * H)), (int(x1 * W) - 1, int(y1 * H) - 1)
        cv2.rectangle(img, p0, p1, (255, 255, 255), 2)
        tag = f"def {team_names.get(z['defending'], z['defending'])}" if "defending" in z else "last touch"
        put_label(img, f"{z['name']} ({tag})", (p0[0] + 2, p0[1] + 16), (60, 60, 60), 0.4)


def draw_score_bar(img, teams, score):
    W = img.shape[1]
    cv2.rectangle(img, (0, 0), (W, 26), (20, 20, 20), -1)
    a, b = teams
    text = f"{a['name']} {score[a['id']]} - {score[b['id']]} {b['name']}"
    (tw, _), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
    cv2.putText(img, text, ((W - tw) // 2, 19), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)


def draw_goal_flash(img, word="GOAL!"):
    H, W = img.shape[:2]
    scale = W / (44 * len(word))
    (tw, th), _ = cv2.getTextSize(word, cv2.FONT_HERSHEY_DUPLEX, scale, 4)
    org = ((W - tw) // 2, (H + th) // 2)
    cv2.putText(img, word, org, cv2.FONT_HERSHEY_DUPLEX, scale, (0, 0, 0), 10, cv2.LINE_AA)
    cv2.putText(img, word, org, cv2.FONT_HERSHEY_DUPLEX, scale, (0, 215, 255), 4, cv2.LINE_AA)


def draw_arena(img, rect):
    H, W = img.shape[:2]
    x0, y0, x1, y1 = rect
    cv2.rectangle(img, (int(x0 * W), int(y0 * H)), (int(x1 * W) - 1, int(y1 * H) - 1), (255, 255, 255), 2)
    put_label(img, "arena", (int(x0 * W) + 2, int(y0 * H) + 16), (60, 60, 60), 0.4)


# ---------------------------------------------------------------- preview

def run_preview(input_path, cfg, out, width=None):
    j = cfg["judge"]
    width = int(width or j["width"])
    cap, frame, _, _ = open_video(input_path)
    cap.release()
    img = resize(frame, width)
    cands = ball_candidates(img, j["ball_hsv_lower"], j["ball_hsv_upper"])
    if cfg["game"] in BALL_GAMES:
        draw_zones(img, j["goal_zones"], {t["id"]: t["name"] for t in cfg["teams"]})
    elif cfg["game"] == "al-karabi":
        draw_arena(img, j["arena"])
    for i, (_, (x0, y0, x1, y1)) in enumerate(cands):
        cv2.rectangle(img, (x0, y0), (x1, y1), (255, 0, 255) if i == 0 else (0, 255, 255), 2)
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    path = out / "preview.jpg"
    cv2.imwrite(str(path), img)
    print(f"Preview saved: {path}  ({len(cands)} ball-colour candidate(s); magenta = best)")
    return str(path)


# ---------------------------------------------------------------- main pipeline

def load_model():
    if not MODEL_PATH.is_file():
        raise JudgeError(
            f"YOLO weights not found at {MODEL_PATH}.\n"
            f"Download them with (run inside {HERE}):\n"
            "  python -c \"from ultralytics import YOLO; YOLO('yolov8n.pt')\""
        )
    from ultralytics import YOLO  # slow import, only when needed
    return YOLO(str(MODEL_PATH))


def source_phrase(sources):
    if sources == {"yolo"}:
        return "seen by the object detector"
    if sources == {"colour"}:
        return "found by its colour only"
    return "seen by the object detector and by colour"


def run_judge(input_path, cfg, out, secret=None, frame_skip=None, width=None, write_video=True, live=False):
    """Analyse a clip and write <out>/report.json (signed), thumbs/, annotated.mp4. Returns the signed report.
    live=True watches a camera instead, streams ticks and signed events to stdout, and skips the video."""
    secret = secret or os.environ.get("BAYT_REPORT_SECRET")
    if not secret:
        raise JudgeError("BAYT_REPORT_SECRET is not set. Export a secret before running, e.g. "
                         "BAYT_REPORT_SECRET=... python judge.py ...")
    cfg = normalise_config(cfg)
    j = cfg["judge"]
    frame_skip = 1 if live else max(1, int(frame_skip or j["frame_skip"]))
    write_video = write_video and not live
    if live:  # thresholds were tuned for every 3rd frame; live checks every frame
        j = {**j, **{k: j[k] * 3 for k in ("goal_min_frames", "out_min_frames", "tag_min_frames")}}
    width = int(width or j["width"])
    teams = cfg["teams"]
    team_ids = [t["id"] for t in teams]
    team_names = {t["id"]: t["name"] for t in teams}
    team_bgr = {t["id"]: hex_to_bgr(t["color"]) for t in teams}
    team_hsv = {tid: bgr_to_hsv(c) for tid, c in team_bgr.items()}
    points = int(cfg["rules"].get("pointsPerGoal", 1))
    game = cfg["game"]
    etype, word = GAMES[game]["event"], GAMES[game]["word"]
    ball_game = game in BALL_GAMES
    zones = j["goal_zones"] if ball_game else []
    out_runs = defaultdict(int)         # al-karabi: track -> consecutive samples outside the arena
    eliminated = set()
    tag_runs = defaultdict(int)         # al-ghomaidah: (seeker, other) -> consecutive touching samples
    tag_cool = {}
    thumbs_done = 0

    cap, first, fps, total = open_camera(input_path) if live else open_video(input_path)
    model = load_model()
    out = Path(out)
    (out / "thumbs").mkdir(parents=True, exist_ok=True)

    dt_ms = int(round(frame_skip * 1000 / fps))
    out_fps = fps / frame_skip
    flash_len = max(1, int(round(out_fps)))  # ~1 s of GOAL! overlay

    writer = None
    raw_path = out / "annotated_raw.mp4"

    votes = defaultdict(Counter)        # track -> team votes
    visible = defaultdict(int)          # track -> ms
    poss = defaultdict(int)             # track -> ms (None = nobody)
    holder, pending, pending_n, last_holder = None, None, 0, None
    score = {tid: 0 for tid in team_ids}
    events = []
    zstate = [{"run": [], "armed": True, "cool_until": -1, "event": None} for _ in zones]
    flash = 0
    frame_idx, samples = 0, 0
    t0 = time.time()
    frame = first
    ctl = {"paused": bool(cfg.get("paused")), "stop": False}
    prev_t, play_ms, emitted = t0, 0, 0

    def next_live():
        """Newest camera frame while playing. While paused, stream the raw view a few times a second."""
        while not ctl["stop"]:
            ok, f = cap.read()
            if not ok:
                return None
            if not ctl["paused"]:
                return f
            emit({"type": "tick", "paused": True, "frame": jpeg_b64(resize(f, width))})
            time.sleep(0.15)
        return None

    if live:  # the first tracking pass is slow, so do it now rather than when the round starts
        model.track(resize(first, width), persist=True, tracker="bytetrack.yaml", imgsz=width, verbose=False)
        threading.Thread(target=read_commands, args=(ctl, j, team_ids), daemon=True).start()
        frame = next_live()

    while frame is not None:
        if frame_idx % frame_skip == 0:
            img = resize(frame, width)
            H, W = img.shape[:2]
            if live:  # match time from the wall clock; pauses don't count
                now = time.time()
                dt_ms, prev_t = min(500, int((now - prev_t) * 1000)), now
                play_ms += dt_ms
                t_ms = play_ms
            else:
                t_ms = int(round(frame_idx * 1000 / fps))
            res = model.track(img, persist=True, tracker="bytetrack.yaml", classes=[0, 32] if ball_game else [0],
                              imgsz=width, conf=0.15, verbose=False)[0]
            persons, ball = [], None
            b = res.boxes
            if b is not None and len(b):
                xyxy = b.xyxy.cpu().numpy()
                cls = b.cls.cpu().numpy().astype(int)
                conf = b.conf.cpu().numpy()
                ids = b.id.cpu().numpy().astype(int) if b.id is not None else [None] * len(cls)
                for box, c, cf, tid in zip(xyxy, cls, conf, ids):
                    box = tuple(int(v) for v in box)
                    if c == 0 and tid is not None:
                        persons.append((int(tid), box))
                    elif c == 32 and cf >= j["ball_min_conf"] and (ball is None or cf > ball[2]):
                        ball = (box, "yolo", float(cf))
            if ball is None and ball_game:
                cands = ball_candidates(img, j["ball_hsv_lower"], j["ball_hsv_upper"])
                if cands:
                    ball = (cands[0][1], "colour", None)

            # teams + visibility
            for tid, box in persons:
                visible[tid] += dt_ms
                v = classify_team(img, box, team_hsv)
                votes[tid][v] += 1
            cur_team = {tid: majority(votes[tid]) for tid, _ in persons}

            # possession (debounced: 2 consecutive agreeing samples to change holder)
            cand = None
            if ball is not None:
                bx = (ball[0][0] + ball[0][2]) / 2
                by = (ball[0][1] + ball[0][3]) / 2
                best = None
                for tid, (x0, y0, x1, y1) in persons:
                    d = math.hypot((x0 + x1) / 2 - bx, y1 - by)
                    if d <= j["possession_radius"] * (y1 - y0) and (best is None or d < best[0]):
                        best = (d, tid)
                cand = best[1] if best else None
            if cand == holder:
                pending, pending_n = None, 0
            elif cand == pending:
                pending_n += 1
                if pending_n >= 2:
                    holder, pending, pending_n = cand, None, 0
            else:
                pending, pending_n = cand, 1
            poss[holder] += dt_ms
            if holder is not None:
                last_holder = holder

            # goals
            new_event = None
            nb = None
            if ball is not None:
                nb = ((ball[0][0] + ball[0][2]) / 2 / W, (ball[0][1] + ball[0][3]) / 2 / H)
            for z, st in zip(zones, zstate):
                x0, y0, x1, y1 = z["rect"]
                inside = nb is not None and x0 <= nb[0] <= x1 and y0 <= nb[1] <= y1
                if not inside:
                    st.update(run=[], armed=True, event=None)
                    continue
                st["run"].append((ball[1], ball[2]))
                ev = st["event"]
                if ev is None and st["armed"] and t_ms >= st["cool_until"] and len(st["run"]) >= j["goal_min_frames"] and (not live or any(src == "yolo" for src, _ in st["run"])):
                    if "defending" in z:
                        scorer, unsure = next(t for t in team_ids if t != z["defending"]), False
                    else:  # last touch: the holder's team, or the team nearest the ball if nobody held it
                        near = sorted(persons, key=lambda p: math.hypot((p[1][0] + p[1][2]) / 2 / W - nb[0],
                                                                        p[1][3] / H - nb[1]))
                        guess = cur_team.get(last_holder) or next((cur_team.get(p[0]) for p in near
                                                                   if cur_team.get(p[0])), None)
                        scorer, unsure = guess or team_ids[0], cur_team.get(last_holder) is None
                    score[scorer] += points
                    n = len(events) + 1
                    ev = {
                        "id": f"{etype}-{n}", "type": etype, "t_ms": t_ms, "team": scorer,
                        "scorer_track": last_holder, "thumb": f"thumbs/{etype}-{n}.jpg",
                        "score_change": {t: (points if t == scorer else 0) for t in team_ids},
                        "_unsure": unsure,
                    }
                    events.append(ev)
                    st.update(event=ev, armed=False, cool_until=t_ms + int(j["goal_cooldown_s"] * 1000))
                    last_holder = None
                    new_event = ev
                    flash = flash_len
                if ev is not None:  # keep refining while the ball stays in the zone
                    run = st["run"]
                    base = sum(cf * 100 if src == "yolo" else 55 for src, cf in run) / len(run)
                    conf_i = int(max(0, min(100, round(base + min(20, 5 * (len(run) - j["goal_min_frames"]))))))
                    if ev["_unsure"]:
                        conf_i = min(conf_i, 50)
                    scorer = ev["team"]
                    toucher = f"track {ev['scorer_track']}" if ev["scorer_track"] is not None else "nobody identified"
                    if "defending" in z:
                        why = f"{team_names[z['defending']]} defends that side, so {team_names[scorer]} scores."
                    elif ev["_unsure"]:
                        why = f"I couldn't see who shot, so I'm guessing {team_names[scorer]}. Please check."
                    else:
                        why = f"{team_names[scorer]} had the ball last, so they score."
                    ev.update(
                        confidence=conf_i,
                        needs_review=conf_i < j["review_threshold"],
                        reason=(f"The ball was inside the {z['name']} zone for {len(run)} checks in a row "
                                f"({source_phrase({s for s, _ in run})}). {why} Last touch: {toucher}."),
                    )

            # al-karabi: a player whose feet stay outside the arena is out; the nearest opponent pushed them
            if game == "al-karabi":
                ax0, ay0, ax1, ay1 = j["arena"]
                for tid, (x0, y0, x1, y1) in persons:
                    fx, fy = (x0 + x1) / 2 / W, y1 / H
                    inside = ax0 <= fx <= ax1 and ay0 <= fy <= ay1
                    out_runs[tid] = 0 if inside else out_runs[tid] + 1
                    loser = cur_team.get(tid)
                    if tid in eliminated or loser is None or out_runs[tid] < j["out_min_frames"]:
                        continue
                    eliminated.add(tid)
                    scorer = next(t for t in team_ids if t != loser)
                    rivals = [(math.hypot((p[1][0] + p[1][2]) / 2 - (x0 + x1) / 2, p[1][3] - y1), p[0])
                              for p in persons if cur_team.get(p[0]) == scorer]
                    pusher = min(rivals)[1] if rivals else None
                    pusher_txt = f"track {pusher}" if pusher is not None else "nobody identified"
                    conf_i = min(95, 55 + 8 * out_runs[tid])
                    score[scorer] += points
                    n = len(events) + 1
                    new_event = {
                        "id": f"{etype}-{n}", "type": etype, "t_ms": t_ms, "team": scorer, "scorer_track": pusher,
                        "thumb": f"thumbs/{etype}-{n}.jpg", "confidence": conf_i,
                        "needs_review": conf_i < j["review_threshold"],
                        "score_change": {t: (points if t == scorer else 0) for t in team_ids},
                        "reason": (f"Track {tid} ({team_names[loser]}) had their feet outside the arena for "
                                   f"{out_runs[tid]} checks in a row, so they're out and {team_names[scorer]} "
                                   f"gets the point. Closest opponent: {pusher_txt}."),
                    }
                    events.append(new_event)
                    flash = flash_len

            # al-ghomaidah: a seeker touching an opponent is a tag (debounced, per-pair cooldown)
            if game == "al-ghomaidah":
                seek = j["seeker"]
                touching = set()
                for sid, (sx0, sy0, sx1, sy1) in persons:
                    if cur_team.get(sid) != seek:
                        continue
                    for oid, (ox0, oy0, ox1, oy1) in persons:
                        if oid == sid or cur_team.get(oid) in (None, seek):
                            continue
                        d = math.hypot((sx0 + sx1 - ox0 - ox1) / 2, (sy0 + sy1 - oy0 - oy1) / 2)
                        if d <= j["tag_radius"] * ((sy1 - sy0) + (oy1 - oy0)) / 2:
                            touching.add((sid, oid))
                for pair in list(tag_runs):
                    if pair not in touching:
                        del tag_runs[pair]
                for sid, oid in sorted(touching):
                    tag_runs[(sid, oid)] += 1
                    if tag_runs[(sid, oid)] < j["tag_min_frames"] or t_ms < tag_cool.get((sid, oid), -1):
                        continue
                    tag_cool[(sid, oid)] = t_ms + int(j["tag_cooldown_s"] * 1000)
                    conf_i = min(95, 50 + 10 * tag_runs[(sid, oid)])
                    score[seek] += points
                    n = len(events) + 1
                    new_event = {
                        "id": f"{etype}-{n}", "type": etype, "t_ms": t_ms, "team": seek, "scorer_track": sid,
                        "thumb": f"thumbs/{etype}-{n}.jpg", "confidence": conf_i,
                        "needs_review": conf_i < j["review_threshold"],
                        "score_change": {t: (points if t == seek else 0) for t in team_ids},
                        "reason": (f"Seeker track {sid} ({team_names[seek]}) was touching track {oid} for "
                                   f"{tag_runs[(sid, oid)]} checks in a row, so I'm counting a tag."),
                    }
                    events.append(new_event)
                    flash = flash_len

            # draw
            draw_zones(img, zones, team_names)
            if game == "al-karabi":
                draw_arena(img, j["arena"])
            for tid, (x0, y0, x1, y1) in persons:
                tm = cur_team.get(tid)
                col = team_bgr.get(tm, GREY)
                cv2.rectangle(img, (x0, y0), (x1, y1), col, 2)
                put_label(img, f"T{tid} - {tm or '?'}", (x0, y0 - 2), col)
                if tid == holder:
                    cv2.ellipse(img, ((x0 + x1) // 2, y1), (max(8, (x1 - x0) // 2), 6), 0, 0, 360, (0, 255, 255), 2)
            if ball is not None:
                (x0, y0, x1, y1), src, _ = ball
                cv2.rectangle(img, (x0, y0), (x1, y1), (0, 165, 255), 2)
                put_label(img, "BALL" + (" (colour)" if src == "colour" else ""), (x0, y0 - 2), (0, 120, 200), 0.4)
                for tid, (px0, py0, px1, py1) in persons:
                    if tid == holder:
                        cv2.line(img, ((px0 + px1) // 2, py1), ((x0 + x1) // 2, (y0 + y1) // 2), (0, 255, 255), 1)
            draw_score_bar(img, teams, score)
            if flash > 0:
                draw_goal_flash(img, word)
                flash -= 1
            for ev in events[thumbs_done:]:  # every event raised this sample gets a frame
                th = resize(img, 480) if W > 480 else img
                cv2.imwrite(str(out / ev["thumb"]), th, [cv2.IMWRITE_JPEG_QUALITY, 85])
            thumbs_done = len(events)
            if live:
                for ev in events[emitted:]:
                    public = {k: v for k, v in ev.items() if not k.startswith("_")}
                    emit({"type": "event", "signed": sign({"run_id": out.name, "event": public}, secret)})
                emitted = len(events)
                credit = Counter(e["scorer_track"] for e in events if e["scorer_track"] is not None)
                seen = [t for t, ms in visible.items() if ms >= 1000]
                seen.sort(key=lambda t: (-(poss.get(t, 0) if ball_game else credit[t]), t))
                emit({"type": "tick", "paused": False, "t_ms": t_ms, "score": score, "frame": jpeg_b64(img),
                      "tracks": [{"track_id": t, "team": majority(votes[t]), "possession_ms": poss.get(t, 0),
                                  "events": credit[t]} for t in seen[:4]]})
            if write_video:
                if writer is None:
                    writer = cv2.VideoWriter(str(raw_path), cv2.VideoWriter_fourcc(*"mp4v"), out_fps, (W, H))
                writer.write(img)

            samples += 1
            if samples % 30 == 0 and not live:
                pct = f"{100 * frame_idx // total}%" if total else f"frame {frame_idx}"
                print(f"  {pct}  ({samples} samples, {time.time() - t0:.0f}s)", flush=True)
        frame_idx += 1
        if live:
            frame = next_live()
            continue
        if (frame_idx % frame_skip == 0):
            ok, frame = cap.read()
        else:
            ok = cap.grab()
            frame = np.empty(0) if ok else None  # placeholder; skipped frames are never decoded
        if not ok:
            frame = None
    cap.release()
    if writer is not None:
        writer.release()

    # annotated video
    annotated = None
    if write_video and raw_path.exists():
        final = out / "annotated.mp4"
        ff = shutil.which("ffmpeg")
        ok = False
        if ff:
            r = subprocess.run([ff, "-y", "-loglevel", "error", "-i", raw_path.name, "-c:v", "libx264",
                                "-pix_fmt", "yuv420p", "-movflags", "+faststart", final.name],
                               cwd=out, capture_output=True, text=True)
            ok = r.returncode == 0 and final.exists()
            if not ok:
                print(f"WARNING: ffmpeg transcode failed, keeping raw video: {r.stderr.strip()[:300]}")
        else:
            print("WARNING: ffmpeg not on PATH, keeping raw mp4v video (may not play in browsers).")
        if ok:
            raw_path.unlink()
            annotated = final.name
        else:
            annotated = raw_path.name

    # report
    final_team = {tid: majority(v) for tid, v in votes.items()}
    team_poss = {tid: 0 for tid in team_ids}
    team_poss["none"] = 0
    for tid, ms in poss.items():
        tm = final_team.get(tid) if tid is not None else None
        team_poss[tm if tm in team_ids else "none"] += ms
    tracks = sorted(
        ({"track_id": tid, "team": final_team.get(tid), "possession_ms": poss.get(tid, 0), "visible_ms": ms}
         for tid, ms in visible.items() if ms >= 1000),
        key=lambda t: (-t["possession_ms"], t["track_id"]),
    )
    if ball_game:
        mvp = tracks[0]["track_id"] if tracks and tracks[0]["possession_ms"] > 0 else None
    else:  # most eliminations / tags
        credit = Counter(e["scorer_track"] for e in events if e["scorer_track"] is not None)
        mvp = credit.most_common(1)[0][0] if credit else None
    for ev in events:
        ev.pop("_unsure", None)

    payload = {
        "run_id": out.name,
        "game": game,
        "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": {"file": "webcam" if live else Path(input_path).name, "fps": int(round(fps)),
                   "duration_ms": play_ms if live else int(round(frame_idx * 1000 / fps)),
                   "frames_processed": samples},
        "teams": [{"id": t["id"], "name": t["name"], "color": t["color"]} for t in teams],
        "players": [p.get("name", "") for p in cfg["players"]],
        "tracks": tracks,
        "events": events,
        "proposed_score": score,
        "possession_ms": team_poss,
        "mvp_track": mvp,
        "annotated_video": annotated,
        "review_threshold": int(j["review_threshold"]),
        "simulated": False,
    }
    assert_ints(payload)
    report = sign(payload, secret)
    with open(out / "report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    a, b2 = teams
    print(f"\nDone in {time.time() - t0:.1f}s: {samples} samples from {frame_idx} frames.")
    print(f"Score: {a['name']} {score[a['id']]} - {score[b2['id']]} {b2['name']}  |  {etype}s: {len(events)}  "
          f"({sum(e['needs_review'] for e in events)} need review)  |  tracks kept: {len(tracks)}  |  MVP track: {mvp}")
    print(f"Report: {out / 'report.json'}" + (f"  Video: {out / annotated}" if annotated else ""))
    if live:
        emit({"type": "done"})
    return report


# ---------------------------------------------------------------- CLI

def main(argv=None):
    ap = argparse.ArgumentParser(description="Bayt AI judge (football, basketball, volleyball, al-karabi, al-ghomaidah)")
    ap.add_argument("--input", help="video file, or a camera index with --live (default 0)")
    ap.add_argument("--live", action="store_true", help="watch a camera live and stream JSON lines")
    ap.add_argument("--config", required=True, help="match.json (see config.example.json)")
    ap.add_argument("--out", required=True, help="output folder; its name becomes run_id")
    ap.add_argument("--preview", action="store_true", help="save preview.jpg of zones + ball candidates and exit")
    ap.add_argument("--frame-skip", type=int, help="process every Nth frame")
    ap.add_argument("--width", type=int, help="resize width for processing")
    ap.add_argument("--no-video", action="store_true", help="skip the annotated video")
    args = ap.parse_args(argv)
    try:
        cfg = load_config(args.config)
        if args.preview:
            if not args.input:
                raise JudgeError("--preview needs --input.")
            run_preview(args.input, cfg, args.out, args.width)
            return 0
        if not os.environ.get("BAYT_REPORT_SECRET"):
            raise JudgeError("BAYT_REPORT_SECRET is not set. Set it first, e.g. "
                             "BAYT_REPORT_SECRET=<secret> python judge.py ... (no default secret is used).")
        if args.live:
            run_judge(args.input or "0", cfg, args.out, width=args.width, live=True)
            return 0
        if not args.input or not Path(args.input).is_file():
            raise JudgeError(f"Input video not found: {args.input}")
        run_judge(args.input, cfg, args.out, frame_skip=args.frame_skip, width=args.width,
                  write_video=not args.no_video)
        return 0
    except JudgeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2
    except MemoryError:
        print("ERROR: out of memory. Try a smaller --width (e.g. 480) or a larger --frame-skip.", file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())

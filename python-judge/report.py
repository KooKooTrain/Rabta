"""Signed report contract for the Bayt judge (canonical JSON + HMAC-SHA256)."""
import hashlib
import hmac
import json


def canonical(payload) -> bytes:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def assert_ints(payload, path="payload"):
    """Raise if any float appears anywhere (floats break cross-language canonical equality)."""
    if isinstance(payload, float):
        raise TypeError(f"float not allowed in report at {path}: {payload!r}")
    if isinstance(payload, dict):
        for k, v in payload.items():
            assert_ints(v, f"{path}.{k}")
    elif isinstance(payload, (list, tuple)):
        for i, v in enumerate(payload):
            assert_ints(v, f"{path}[{i}]")


def sign(payload, secret) -> dict:
    return {
        "alg": "HMAC-SHA256",
        "canon": "bayt-canon-v1",
        "payload": payload,
        "signature": hmac.new(secret.encode(), canonical(payload), hashlib.sha256).hexdigest(),
    }


def verify(report, secret) -> bool:
    expected = hmac.new(secret.encode(), canonical(report["payload"]), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, report.get("signature", ""))


if __name__ == "__main__":
    p = {"proposed_score": {"A": 1, "B": 0}, "teams": [{"id": "A", "name": "Équipe A"}], "simulated": False}
    assert_ints(p)
    r = sign(p, "test")
    assert verify(r, "test")
    assert not verify(r, "wrong")
    r["payload"]["proposed_score"]["A"] = 2
    assert not verify(r, "test")
    try:
        assert_ints({"x": [1, {"y": 0.5}]})
        raise AssertionError("float not caught")
    except TypeError:
        pass
    print("report self-check ok")

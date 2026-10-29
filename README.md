# Rabta

**Rabta is an AI-assisted referee and game-day companion for family sports.** Choose a game, set up teams, play together, and review a clear match report.

## Live site

[rabtaadu.netlify.app](https://rabtaadu.netlify.app/)

<<<<<<< HEAD
## What you can do

- Play football, basketball, volleyball, Al Karabi, and Al Ghomaidah.
- Set up players, teams, and game rules.
- Review match results and keep a history of finished games.
- Plan family practices and matches in the sports calendar.
- Use the interface in English or Arabic, with light and dark themes.
- Ask the game assistant about supported sports, rules, schedules, and match reports.

Rabta is a prototype built for the **6th Annual ADU COE STEM Programming with AI Competition**, Advanced Track, under the theme **AI for Family**.

## Run locally

Requirements: Node.js 20.9 or later (Node.js 22 recommended).

```bash
git clone https://github.com/KooKooTrain/Rabta.git
cd Rabta
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next.js will show the alternate local URL in the terminal.

The assistant uses scripted demo replies by default, so no API key is needed to get started. To connect an AI provider, copy `.env.example` to `.env.local` and set `AI_PROVIDER`, `AI_API_KEY`, and `AI_MODEL`. Keep API keys server-side; do not add a `NEXT_PUBLIC_` prefix.

## Video judging

The optional Python video judge is in `python-judge/`. It analyzes a recorded match and produces a report for the host to review. To set it up on Windows, install the packages and model:

```powershell
cd python-judge
py -3.14 -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

The video-judging pipeline is intended to run locally and may not be available on the live Netlify site. The host should review and confirm every report before saving a result.

## Project commands

```bash
npm run dev      # Start the development server
npm run build    # Build for production
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Python video analysis with YOLO and OpenCV.

Family profiles, preferences, schedules, and match history are stored in the browser on the current device. The prototype does not currently use family accounts or a cloud database.
=======
## Other Important Links 

[Youtube Video](https://youtu.be/KssukFNXCMY?si=WxtoGLBK-sls0X-p) 

[Presentation](https://canva.link/d88kv7pmlmhg0v2)  [PPT was above 10mb so we could not upload it, so we have linked our presentation here]


## What you can do

- Play football, basketball, volleyball, Al Karabi, and Al Ghomaidah.
- Set up players, teams, and game rules.
- Review match results and keep a history of finished games.
- Plan family practices and matches in the sports calendar.
- Use the interface in English or Arabic, with light and dark themes.
- Ask the game assistant about supported sports, rules, schedules, and match reports.

Rabta is a prototype built for the **6th Annual ADU COE STEM Programming with AI Competition**, Advanced Track, under the theme **AI for Family**.

## Run locally

Requirements: Node.js 20.9 or later (Node.js 22 recommended).

```bash
git clone https://github.com/KooKooTrain/Rabta.git
cd Rabta
npm install
npm run dev
>>>>>>> f653f7b5b391b1a1a3cb49c3d2210d2786669f2f


# Rabta | رابطة

### Bringing families together, one game at a time.

**Rabta is an AI-assisted referee and game-day companion for family sports.** Choose a game, set up teams, play together, and review a clear match report.

---

## Live Demo & Project Links

| Resource | Link |
|---|---|
| **Live Website** | [rabtaadu.netlify.app](https://rabtaadu.netlify.app/) |
| **Demo Video** | [Watch on YouTube](https://youtu.be/KssukFNXCMY?si=WxtoGLBK-sls0X-p) |
| **Project Presentation** | [View on Canva](https://canva.link/d88kv7pmlmhg0v2) |

> **Presentation note:** The presentation exceeded the 10 MB upload limit, so it is provided through the Canva link above.

---

## Features

- **Multiple Sports:** Play football, basketball, volleyball, Al Karabi, and Al Ghomaidah.
- **Game Setup:** Configure players, teams, and game rules.
- **AI-Assisted Refereeing:** Analyse recorded matches and generate judging reports.
- **Match History:** Review results and revisit completed games.
- **Sports Calendar:** Organise family practices and upcoming matches.
- **Bilingual Experience:** Switch between English and Arabic.
- **Personalisation:** Choose between light and dark themes.
- **Game Assistant:** Ask questions about supported sports, rules, schedules, and match reports.

---

## About the Project

Rabta was developed for the **6th Annual ADU COE STEM Programming with AI Competition**, under the **Advanced Track**, with the theme **AI for Family**.

The project aims to make family sports more engaging through AI-assisted game judging, accessible match management, and a shared space for organising family activities.

---

## Getting Started

### Prerequisites

- Node.js 20.9 or later (Node.js 22 recommended)
- npm
- Git

### Installation

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/KooKooTrain/Rabta.git
cd Rabta
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

If port 3000 is already occupied, Next.js will provide an alternative local URL in the terminal.

---

## AI Assistant Configuration

The assistant uses scripted demo replies by default, so no API key is required to get started.

To connect an AI provider:

1. Copy `.env.example` to `.env.local`.
2. Configure the following environment variables:

```env
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

Keep API keys server-side. Never expose them using a `NEXT_PUBLIC_` prefix.

---

## AI Video Judging

Rabta includes an optional Python-based video judging module located in `python-judge/`.

It analyses recorded matches and generates a report for the host to review and confirm before saving the result.

### Windows Setup

Navigate to the judging module:

```powershell
cd python-judge
```

Create a virtual environment:

```powershell
py -3.14 -m venv .venv
```

Install dependencies:

```powershell
.venv\Scripts\python -m pip install -r requirements.txt
```

Download the YOLO model:

```powershell
.venv\Scripts\python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

**Note:** The video-judging pipeline is intended to run locally and may not be available on the live Netlify deployment. The host should review and confirm every generated report before saving a match result.

---

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the project for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## Technology Stack

**Frontend**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

**AI & Computer Vision**
- Python
- YOLO
- OpenCV

---

## Data & Storage

Family profiles, preferences, schedules, and match history are stored locally in the browser on the current device.

The current prototype does not use family accounts or a cloud database.

---

<p align="center">

**Rabta — رابطة**

*Play together. Grow together.*

</p>

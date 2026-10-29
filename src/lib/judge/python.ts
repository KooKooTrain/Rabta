import path from "node:path";

/** Server-only paths for the local Python judge in python-judge/. */
export const JUDGE_DIR = path.resolve(process.cwd(), "python-judge");
export const PYTHON = path.join(JUDGE_DIR, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");

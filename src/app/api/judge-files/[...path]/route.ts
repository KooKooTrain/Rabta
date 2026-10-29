import { readFile, stat } from "node:fs/promises";
import path from "node:path";

/**
 * GET /api/judge-files/<run_id>/<file>  → thumbnails and annotated video written by
 * python-judge into python-judge/outputs. Read-only, path-contained, jpg/png/mp4 only.
 * ponytail: reads the whole file per request; fine for short local demo clips.
 */

const ROOT = path.resolve(process.cwd(), "python-judge", "outputs");
const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4" };

const notFound = (msg: string) => Response.json({ error: msg }, { status: 404 });

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path ?? [];
  const file = path.resolve(ROOT, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!file.startsWith(ROOT + path.sep) || !type) return notFound("Not a judge output file.");

  let size: number;
  try {
    size = (await stat(file)).size;
  } catch {
    return notFound("That file isn't there. Was the judge run on this machine?");
  }

  const data = await readFile(file);
  const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "no-store" };

  // Browsers seek in <video> with Range requests.
  const range = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") ?? "");
  if (range && type === "video/mp4") {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    return new Response(data.subarray(start, end + 1), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new Response(data, { headers: { ...headers, "Content-Length": String(size) } });
}

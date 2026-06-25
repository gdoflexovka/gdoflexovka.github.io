import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-_]/g, "").replace(/\s+/g, "-").toLowerCase().replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function readLevelsFile(): string | null {
  const p = path.resolve("src/lib/levels.ts");
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

function writeLevelsFile(content: string): void {
  fs.writeFileSync(path.resolve("src/lib/levels.ts"), content, "utf-8");
}

function addTrackToFile(title: string, author: string, audioPath: string): { id: string } | null {
  let content = readLevelsFile();
  if (!content) return null;

  const id = "t" + Date.now().toString(36);
  const audioPart = audioPath ? `, audioSrc: "${audioPath}"` : "";
  const newEntry = `  { id: "${id}", title: "${title.replace(/"/g, '\\"')}", author: "${author.replace(/"/g, '\\"')}"${audioPart} },`;

  const idx = content.indexOf("export const TRACKS: Track[] = [");
  if (idx < 0) return null;
  const closing = content.indexOf("];", idx);
  if (closing < 0) return null;

  content = content.slice(0, closing) + newEntry + "\n" + content.slice(closing);
  writeLevelsFile(content);
  return { id };
}

function removeTrackFromFile(id: string): boolean {
  let content = readLevelsFile();
  if (!content) return false;
  content = content.replace(new RegExp(`\\s*\\{\\s*id:\\s*"${id}"[^}]*\\},?\\n?`, "g"), "");
  writeLevelsFile(content);
  return true;
}

function addChapterToFile(title: string): { id: string } | null {
  let content = readLevelsFile();
  if (!content) return null;

  const id = "ch" + Date.now().toString(36);
  const newEntry = `  {\n    id: "${id}",\n    title: "${title.replace(/"/g, '\\"')}",\n    levelIds: [],\n  },`;

  const idx = content.indexOf("export const CHAPTERS: Chapter[] = [");
  if (idx < 0) return null;
  const closing = content.indexOf("];", idx);
  if (closing < 0) return null;

  content = content.slice(0, closing) + newEntry + "\n" + content.slice(closing);
  writeLevelsFile(content);
  return { id };
}

function removeChapterFromFile(id: string): boolean {
  let content = readLevelsFile();
  if (!content) return false;

  const chapterStart = content.indexOf(`id: "${id}"`);
  if (chapterStart < 0) return false;

  const blockStart = content.lastIndexOf("{", chapterStart);
  const blockEnd = content.indexOf("},", blockStart);
  if (blockStart < 0 || blockEnd < 0) return false;

  content = content.slice(0, blockStart) + content.slice(blockEnd + 2);
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");
  writeLevelsFile(content);
  return true;
}

function addLevelToFile(chapterId: string, trackId: string): { id: string } | null {
  let content = readLevelsFile();
  if (!content) return null;

  const id = "l" + Date.now().toString(36);
  const newEntry = `  { id: "${id}", trackId: "${trackId}" },`;

  const idx = content.indexOf("export const LEVELS: Level[] = [");
  if (idx < 0) return null;
  const closing = content.indexOf("];", idx);
  if (closing < 0) return null;

  content = content.slice(0, closing) + newEntry + "\n" + content.slice(closing);

  const chapterIdx = content.indexOf(`id: "${chapterId}"`);
  if (chapterIdx > 0) {
    const levelIdsIdx = content.indexOf("levelIds:", chapterIdx);
    const bracketIdx = content.indexOf("[", levelIdsIdx);
    if (bracketIdx > 0) {
      const afterBracket = content.slice(bracketIdx + 1);
      const hasContent = afterBracket.trimStart().startsWith('"');
      content = content.slice(0, bracketIdx + 1) + (hasContent ? " " : "") + `"${id}"` + (hasContent ? "," : "") + afterBracket;
    }
  }

  writeLevelsFile(content);
  return { id };
}

function removeLevelFromFile(id: string): boolean {
  let content = readLevelsFile();
  if (!content) return false;
  content = content.replace(new RegExp(`\\s*\\{\\s*id:\\s*"${id}"[^}]*\\},?\\n?`, "g"), "");
  content = content.replace(new RegExp(`"${id}"\\s*,?\\s*`, "g"), "");
  content = content.replace(/,\s*,/g, ",");
  content = content.replace(/\[\s*,/g, "[");
  writeLevelsFile(content);
  return true;
}

function editLevelTrack(id: string, trackId: string): boolean {
  let content = readLevelsFile();
  if (!content) return false;
  content = content.replace(
    new RegExp(`(id:\\s*"${id}",\\s*trackId:\\s*")[^"]*(")`),
    `$1${trackId}$2`
  );
  writeLevelsFile(content);
  return true;
}

export function adminApiPlugin(): Plugin {
  return {
    name: "admin-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/admin", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          const raw = await readBody(req);
          const body = JSON.parse(raw);
          const op = body.op;

          res.setHeader("Content-Type", "application/json");

          if (op === "add-track") {
            const title = (body.title || "").trim();
            const author = (body.author || "").trim() || "—";
            const mp3Base64: string | undefined = body.mp3Base64;
            const mp3Filename: string = body.mp3Filename || "track.mp3";

            if (!title) { res.statusCode = 400; res.end(JSON.stringify({ error: "No title" })); return; }

            let audioPath = "";
            if (mp3Base64) {
              const dir = path.resolve("public/tracks");
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              const fn = (sanitizeFilename(title) || "track") + (path.extname(mp3Filename) || ".mp3");
              fs.writeFileSync(path.join(dir, fn), Buffer.from(mp3Base64, "base64"));
              audioPath = "/tracks/" + fn;
            }

            const r = addTrackToFile(title, author, audioPath);
            if (!r) { res.statusCode = 500; res.end(JSON.stringify({ error: "File write failed" })); return; }
            res.end(JSON.stringify({ ok: true, id: r.id, title, author, audioPath }));
          }
          else if (op === "remove-track") {
            if (!body.id) { res.statusCode = 400; res.end(JSON.stringify({ error: "No id" })); return; }
            removeTrackFromFile(body.id);
            res.end(JSON.stringify({ ok: true }));
          }
          else if (op === "add-chapter") {
            const title = (body.title || "").trim();
            if (!title) { res.statusCode = 400; res.end(JSON.stringify({ error: "No title" })); return; }
            const r = addChapterToFile(title);
            if (!r) { res.statusCode = 500; res.end(JSON.stringify({ error: "File write failed" })); return; }
            res.end(JSON.stringify({ ok: true, id: r.id, title }));
          }
          else if (op === "remove-chapter") {
            if (!body.id) { res.statusCode = 400; res.end(JSON.stringify({ error: "No id" })); return; }
            removeChapterFromFile(body.id);
            res.end(JSON.stringify({ ok: true }));
          }
          else if (op === "add-level") {
            if (!body.chapterId || !body.trackId) { res.statusCode = 400; res.end(JSON.stringify({ error: "Need chapterId and trackId" })); return; }
            const r = addLevelToFile(body.chapterId, body.trackId);
            if (!r) { res.statusCode = 500; res.end(JSON.stringify({ error: "File write failed" })); return; }
            res.end(JSON.stringify({ ok: true, id: r.id }));
          }
          else if (op === "remove-level") {
            if (!body.id) { res.statusCode = 400; res.end(JSON.stringify({ error: "No id" })); return; }
            removeLevelFromFile(body.id);
            res.end(JSON.stringify({ ok: true }));
          }
          else if (op === "edit-level-track") {
            if (!body.id || !body.trackId) { res.statusCode = 400; res.end(JSON.stringify({ error: "Need id and trackId" })); return; }
            editLevelTrack(body.id, body.trackId);
            res.end(JSON.stringify({ ok: true }));
          }
          else {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Unknown op: " + op }));
          }
        } catch (err) {
          console.error("[admin-api]", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

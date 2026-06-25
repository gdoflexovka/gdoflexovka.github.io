import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { isAdminAuthenticated, CHAPTERS, LEVELS, TRACKS, getLevelById, getTrackById } from "@/lib/levels";

export const Route = createFileRoute("/admin/chapters")({
  component: ChaptersAdmin,
});

function ChaptersAdmin() {
  const [authed] = useState(() => isAdminAuthenticated());
  if (!authed) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground"><Link to="/admin" className="text-primary hover:underline">← Войти в админку</Link></div>;
  return <ChapterManager />;
}

function LevelCard({ lv, idx, tracks, onSetTrack, onDelete, loading }: {
  lv: { id: string; trackId: string | null };
  idx: number;
  tracks: typeof TRACKS;
  onSetTrack: (id: string, trackId: string | null) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const trk = lv.trackId ? getTrackById(lv.trackId) : undefined;
  const [picker, setPicker] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 px-4 py-3 hover:border-primary/50 transition-colors">
      <span className="text-xs font-mono text-muted-foreground w-6">{idx + 1}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">Уровень {idx + 1}</p>
        {trk ? (
          <p className="text-xs text-muted-foreground truncate">{trk.title} — {trk.author}{trk.newgroundsUrl ? " · NG" : ""}</p>
        ) : (
          <p className="text-xs text-destructive/60 truncate">Без музыки</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        {picker ? (
          <select
            value={lv.trackId ?? ""}
            onChange={e => { onSetTrack(lv.id, e.target.value || null); setPicker(false); }}
            className="rounded border border-primary bg-card px-2 py-1.5 text-xs outline-none"
            autoFocus
          >
            <option value="">— Без музыки —</option>
            {tracks.map(t => <option key={t.id} value={t.id}>{t.title} — {t.author}{t.newgroundsUrl ? " [NG]" : ""}</option>)}
          </select>
        ) : (
          <button
            onClick={() => setPicker(true)}
            className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-primary hover:border-primary transition-colors"
          >
            {trk ? "Сменить" : "Выбрать"}
          </button>
        )}
        <button
          onClick={() => onDelete(lv.id)}
          disabled={loading}
          className="rounded-md border border-border/50 px-2 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-40 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function ChapterManager() {
  const [chapters, setChapters] = useState([...CHAPTERS]);
  const [showChForm, setShowChForm] = useState(false);
  const [chTitle, setChTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCh, setExpandedCh] = useState<string | null>(null);

  const refresh = () => setChapters([...CHAPTERS]);
  const tracks = [...TRACKS];

  const api = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/admin", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    return res.json();
  };

  const addChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle.trim()) return;
    setLoading(true); setMsg("");
    try {
      const d = await api({ op: "add-chapter", title: chTitle.trim() });
      if (d.ok) { setMsg("Глава добавлена"); refresh(); setChTitle(""); setShowChForm(false); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const delChapter = async (id: string, title: string) => {
    if (!confirm(`Удалить главу "${title}"?`)) return;
    setLoading(true); setMsg("");
    try {
      const d = await api({ op: "remove-chapter", id });
      if (d.ok) { setMsg("Глава удалена"); refresh(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const addLevel = async (chapterId: string) => {
    setLoading(true); setMsg("");
    try {
      const d = await api({ op: "add-level", chapterId });
      if (d.ok) { refresh(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const delLevel = async (id: string) => {
    if (!confirm("Удалить уровень?")) return;
    setLoading(true); setMsg("");
    try {
      const d = await api({ op: "remove-level", id });
      if (d.ok) { refresh(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  const setLevelTrack = async (levelId: string, trackId: string | null) => {
    setLoading(true); setMsg("");
    try {
      const d = await api({ op: "edit-level-track", id: levelId, trackId });
      if (d.ok) { refresh(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-30" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-bold tracking-tight">GDof<span className="text-primary">Lexovka</span></Link>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm text-primary hover:underline">← Треки</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">На главную</Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Админ — Главы</p>
          <h1 className="mt-2 text-3xl font-bold">Главы и уровни</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Создай главу, добавь уровни, затем нажми «Выбрать» на уровне чтобы назначить музыку.
          </p>
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={() => { setChTitle(""); setShowChForm(!showChForm); }} disabled={loading} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] hover:shadow-[var(--glow-blue)] disabled:opacity-60 transition-all">
            {showChForm ? "× Закрыть" : "+ Новая глава"}
          </button>
        </div>
        {msg && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm animate-fade-up ${msg.startsWith("Ошибка") ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary"}`}>{msg}</div>
        )}
        {showChForm && (
          <form onSubmit={addChapter} className="mb-8 rounded-xl border border-border bg-card/60 p-6 backdrop-blur animate-fade-up">
            <h3 className="text-sm font-semibold mb-4">Новая глава</h3>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Название главы</label>
              <input type="text" value={chTitle} onChange={e => setChTitle(e.target.value)} required placeholder="Например: Хардкорные демоны" className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={loading} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] disabled:opacity-60 transition-all">{loading ? "..." : "Создать"}</button>
              <button type="button" onClick={() => setShowChForm(false)} className="rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground hover:border-primary">Отмена</button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {chapters.length === 0 && <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center"><p className="text-sm text-muted-foreground">Нет глав</p></div>}
          {chapters.map(ch => {
            const chLevels = ch.levelIds.map(id => getLevelById(id)).filter(Boolean) as { id: string; trackId: string | null }[];
            const expanded = expandedCh === ch.id;
            return (
              <div key={ch.id} className="rounded-xl border border-border bg-card/40 overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-card/60" onClick={() => setExpandedCh(expanded ? null : ch.id)}>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg text-muted-foreground">{expanded ? "▾" : "▸"}</span>
                    <div>
                      <p className="text-sm font-semibold">{ch.title}</p>
                      <p className="text-xs text-muted-foreground">{chLevels.length} уровней</p>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); delChapter(ch.id, ch.title); }} disabled={loading} className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive">Удалить</button>
                </div>
                {expanded && (
                  <div className="border-t border-border px-5 py-4 space-y-2">
                    {chLevels.map((lv, i) => (
                      <LevelCard key={lv.id} lv={lv} idx={i} tracks={tracks} onSetTrack={setLevelTrack} onDelete={delLevel} loading={loading} />
                    ))}
                    <button
                      onClick={() => addLevel(ch.id)}
                      disabled={loading}
                      className="w-full rounded-lg border border-dashed border-border py-2.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                    >
                      + Добавить уровень
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

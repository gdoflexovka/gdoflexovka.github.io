import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { adminLogin, adminLogout, isAdminAuthenticated, TRACKS, type Track } from "@/lib/levels";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => setAuthed(isAdminAuthenticated()), []);
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminShell />;
}

function AdminShell() {
  const location = useLocation();
  const isExactAdmin = location.pathname === "/admin";

  return (
    <>
      {isExactAdmin && <TrackManager />}
      <Outlet />
    </>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const h = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(u, p)) onLogin();
    else { setErr("Неверный логин или пароль"); setTimeout(() => setErr(""), 2000); }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-30" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <Link to="/" className="block mb-8 text-center text-lg font-bold tracking-tight">GDof<span className="text-primary">Lexovka</span></Link>
        <form onSubmit={h} className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur">
          <h1 className="text-xl font-bold mb-6">Админ-панель</h1>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Логин</label>
          <input type="text" value={u} onChange={e => setU(e.target.value)} autoComplete="username" className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary mb-4" placeholder="admin" />
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Пароль</label>
          <input type="password" value={p} onChange={e => setP(e.target.value)} autoComplete="current-password" className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary mb-6" placeholder="••••" />
          {err && <p className="text-xs text-destructive mb-4 animate-pulse">{err}</p>}
          <button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.02] hover:shadow-[var(--glow-blue)] transition-all">Войти</button>
        </form>
        <div className="mt-6 text-center"><Link to="/" className="text-xs text-muted-foreground hover:text-primary">← На главную</Link></div>
      </div>
    </div>
  );
}

function TrackManager() {
  const [tracks, setTracks] = useState<Track[]>([...TRACKS]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [mp3B64, setMp3B64] = useState("");
  const [mp3Fn, setMp3Fn] = useState("");
  const [fnDisplay, setFnDisplay] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = () => setTracks([...TRACKS]);
  const reset = () => { setTitle(""); setAuthor(""); setMp3B64(""); setMp3Fn(""); setFnDisplay(""); setShowForm(false); if (fileRef.current) fileRef.current.value = ""; };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("audio/") && !f.name.endsWith(".mp3")) { alert("Только MP3"); if (fileRef.current) fileRef.current.value = ""; return; }
    if (f.size > 30*1024*1024) { alert("Максимум 30 МБ"); if (fileRef.current) fileRef.current.value = ""; return; }
    setMp3Fn(f.name);
    setFnDisplay(f.name + ` (${(f.size/1024/1024).toFixed(1)} МБ)`);
    const r = new FileReader();
    r.onload = () => { const d = r.result as string; setMp3B64(d.split(",")[1]); };
    r.onerror = () => alert("Ошибка чтения");
    r.readAsDataURL(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/admin", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ op: "add-track", title: title.trim(), author: author.trim(), mp3Base64: mp3B64 || undefined, mp3Filename: mp3Fn || undefined }) });
      const d = await res.json();
      if (res.ok && d.ok) { setMsg(`Трек "${d.title}" добавлен`); refresh(); reset(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения. Админка только через dev.bat"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 5000);
  };

  const del = async (tid: string, ttl: string) => {
    if (!confirm(`Удалить трек "${ttl}"?`)) return;
    setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/admin", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ op: "remove-track", id: tid }) });
      const d = await res.json();
      if (res.ok && d.ok) { setMsg("Трек удалён"); refresh(); }
      else setMsg("Ошибка: " + (d.error || "?"));
    } catch { setMsg("Ошибка соединения"); }
    setLoading(false);
    setTimeout(() => setMsg(""), 5000);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-30" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-bold tracking-tight">GDof<span className="text-primary">Lexovka</span></Link>
        <div className="flex items-center gap-4">
          <Link to="/admin/chapters" className="text-sm text-primary hover:underline">Главы и уровни →</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← На главную</Link>
          <button onClick={() => { adminLogout(); setTracks([...TRACKS]); window.location.reload(); }} className="text-sm text-muted-foreground hover:text-destructive">Выйти</button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Админ — Треки</p>
          <h1 className="mt-2 text-3xl font-bold">Медиатека</h1>
          <p className="mt-2 text-sm text-muted-foreground">{tracks.length} треков. Сначала добавь музыку, потом назначь её уровням в разделе «Главы и уровни».</p>
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={() => { reset(); setShowForm(!showForm); }} disabled={loading} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] hover:shadow-[var(--glow-blue)] disabled:opacity-60 transition-all">
            {showForm ? "× Закрыть" : "+ Добавить трек"}
          </button>
        </div>
        {msg && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm animate-fade-up ${msg.startsWith("Ошибка") ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary"}`}>{msg}</div>
        )}
        {showForm && (
          <form onSubmit={submit} className="mb-8 rounded-xl border border-border bg-card/60 p-6 backdrop-blur animate-fade-up">
            <h3 className="text-sm font-semibold mb-4">Новый трек</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Название</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Название трека" className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Автор</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Автор" className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">MP3 файл</label>
                <input ref={fileRef} type="file" accept="audio/mpeg,.mp3" onChange={onFile} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:bg-card file:text-sm file:text-foreground file:cursor-pointer hover:file:border-primary" />
                {fnDisplay && <p className="mt-2 text-xs text-muted-foreground">Выбран: <span className="text-primary">{fnDisplay}</span></p>}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={loading || !title.trim()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] disabled:opacity-60 transition-all">{loading ? "..." : "Добавить"}</button>
              <button type="button" onClick={reset} className="rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground hover:border-primary">Отмена</button>
            </div>
          </form>
        )}
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Треки ({tracks.length})</h3>
        {tracks.length === 0 && <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center"><p className="text-sm text-muted-foreground">Нет треков</p></div>}
        <div className="space-y-2">
          {tracks.map(t => (
            <div key={t.id} className="flex items-center gap-4 rounded-lg border border-border bg-card/40 px-5 py-4 hover:border-primary transition-all">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.author}{t.audioSrc ? ` · ${t.audioSrc}` : " · без mp3"}</p>
              </div>
              <button onClick={() => del(t.id, t.title)} disabled={loading} className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-40">Удалить</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

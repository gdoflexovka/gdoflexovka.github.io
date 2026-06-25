import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { STAGES, CHAPTERS, TRACKS, getChapterById, getLevelById, getTrackById, normalizeAnswer, type Chapter } from "@/lib/levels";

export const Route = createFileRoute("/play/$chapter")({
  loader: ({ params }: { params: { chapter: string } }) => {
    const chapter = getChapterById(params.chapter);
    if (!chapter) throw notFound();
    return { chapter };
  },
  component: PlayPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-foreground bg-background">
      <div className="text-center">
        <p className="text-xl">Глава не найдена</p>
        <Link to="/chapters" className="text-primary hover:underline mt-4 inline-block">← К списку глав</Link>
      </div>
    </div>
  ),
});

type Result = { levelId: string; points: number; stageReached: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function PlayPage() {
  const { chapter } = Route.useLoaderData() as { chapter: Chapter };
  if (!chapter) throw notFound();

  const order = useMemo(() => shuffle(chapter.levelIds), [chapter]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "wrong">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentLevel = levelIdx < order.length ? getLevelById(order[levelIdx]) : undefined;
  const currentTrack = currentLevel ? getTrackById(currentLevel.trackId) : undefined;
  const currentStage = STAGES[stageIdx];
  const isFinished = levelIdx >= order.length;

  const allOptions = useMemo(() => TRACKS.map(t => `${t.title} — ${t.author}`), []);

  const stopAudio = () => {
    if (stopTimerRef.current !== null) { window.clearTimeout(stopTimerRef.current); stopTimerRef.current = null; }
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setIsPlaying(false);
  };

  useEffect(() => () => stopAudio(), []);
  useEffect(() => { stopAudio(); setStageIdx(0); setAnswer(""); setFeedback("idle"); }, [levelIdx]);

  const playSnippet = async () => {
    if (!currentTrack?.audioSrc) return;
    const a = audioRef.current;
    if (!a) return;
    stopAudio();
    try {
      a.currentTime = 0;
      await a.play();
      setIsPlaying(true);
      stopTimerRef.current = window.setTimeout(() => stopAudio(), currentStage.duration * 1000);
    } catch { setIsPlaying(false); }
  };

  const finishLevel = (points: number, stageReached: number) => {
    stopAudio();
    if (!currentLevel) return;
    setResults(r => [...r, { levelId: currentLevel.id, points, stageReached }]);
    setLevelIdx(i => i + 1);
  };

  const extractTitle = (input: string): string => {
    const idx = input.indexOf(" — ");
    return idx >= 0 ? input.slice(0, idx).trim() : input.trim();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrack || !answer.trim()) return;
    const guessed = extractTitle(answer);
    if (normalizeAnswer(guessed) === normalizeAnswer(currentTrack.title)) {
      finishLevel(currentStage.points, stageIdx);
    } else {
      setFeedback("wrong");
      setAnswer("");
      setTimeout(() => setFeedback("idle"), 600);
      if (stageIdx + 1 >= STAGES.length) finishLevel(0, -1);
      else setStageIdx(s => s + 1);
    }
  };

  const skip = () => {
    if (stageIdx + 1 >= STAGES.length) finishLevel(0, -1);
    else { stopAudio(); setStageIdx(s => s + 1); }
  };

  const giveUp = () => finishLevel(0, -1);
  const totalPoints = results.reduce((s, r) => s + r.points, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-30" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-bold tracking-tight">GDof<span className="text-primary">Lexovka</span></Link>
        <Link to="/chapters" className="text-sm text-muted-foreground hover:text-foreground">← К главам</Link>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">{chapter.title}</p>
        {!isFinished && currentLevel && currentTrack && (
          <>
            <div className="mt-4 flex items-baseline justify-between">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Уровень {levelIdx + 1} / {order.length}</h1>
              <div className="text-sm text-muted-foreground">Счёт: <span className="font-bold text-foreground">{totalPoints}</span></div>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-2">
              {STAGES.map((s, i) => (
                <div key={s.label} className={`rounded-lg border p-3 text-center transition-all ${i === stageIdx ? "border-primary bg-primary/10 shadow-[var(--glow-blue)]" : i < stageIdx ? "border-border bg-card/30 opacity-50" : "border-border bg-card/40"}`}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-sm font-bold">{s.duration}с</div>
                  <div className="text-[10px] text-primary">{s.points} очк</div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
              {currentTrack.audioSrc ? (
                <>
                  <audio ref={audioRef} src={currentTrack.audioSrc} preload="auto" onEnded={stopAudio} />
                  <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={playSnippet} disabled={isPlaying} className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[var(--glow-blue)] disabled:opacity-60">
                      {isPlaying ? `Играет ${currentStage.duration}с...` : `▶ Воспроизвести ${currentStage.duration}с`}
                    </button>
                    <div className="text-xs text-muted-foreground">Можно жать сколько угодно раз</div>
                  </div>
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground">Трек ещё не загружен.</div>
              )}
            </div>
            <form onSubmit={submit} className="mt-6">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Название или автор трека</label>
              <div className="mt-2 flex gap-2">
                <input value={answer} onChange={e => setAnswer(e.target.value)} list="all-levels" autoComplete="off" placeholder="Название или автор..."
                  className={`flex-1 rounded-lg border bg-card/60 px-4 py-3 text-sm outline-none backdrop-blur transition-colors focus:border-primary ${feedback === "wrong" ? "border-destructive animate-pulse" : "border-border"}`} />
                <datalist id="all-levels">{allOptions.map(t => <option key={t} value={t} />)}</datalist>
                <button type="submit" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]">Ответить</button>
              </div>
              {feedback === "wrong" && <p className="mt-2 text-xs text-destructive">Не засчитано — следующий этап</p>}
            </form>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={skip} className="flex-1 rounded-lg border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">Пропустить этап →</button>
              <button type="button" onClick={giveUp} className="rounded-lg border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive hover:text-destructive">Сдаться</button>
            </div>
          </>
        )}
        {isFinished && (
          <div className="mt-12 rounded-2xl border border-border bg-card/60 p-8 backdrop-blur animate-fade-up">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Глава пройдена</p>
            <h1 className="mt-2 text-4xl font-bold">Итог</h1>
            <div className="mt-6 text-6xl font-bold text-gradient-blue">{totalPoints} <span className="text-2xl text-muted-foreground">очк.</span></div>
            <div className="mt-8 space-y-2">
              {results.map((r, i) => {
                const lvl = getLevelById(r.levelId);
                const trk = lvl ? getTrackById(lvl.trackId) : undefined;
                const stage = r.stageReached >= 0 ? STAGES[r.stageReached] : null;
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{i + 1}.</span>{" "}
                      <span className="font-semibold">{trk?.title || "?"}</span>
                      {trk?.author && trk.author !== "—" && <span className="text-xs text-muted-foreground ml-1">— {trk.author}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      {stage ? <span className="text-xs text-muted-foreground">{stage.label}</span> : <span className="text-xs text-destructive">не угадал</span>}
                      <span className="font-bold text-primary w-10 text-right">{r.points}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex gap-3">
              <Link to="/play/$chapter" params={{ chapter: chapter.id }} reloadDocument className="flex-1 rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02]">Ещё раз</Link>
              <Link to="/chapters" className="flex-1 rounded-lg border border-border bg-card/40 px-5 py-3 text-center text-sm font-semibold transition-colors hover:border-primary">К главам</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

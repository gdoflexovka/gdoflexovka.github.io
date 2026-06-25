import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GDofLexovka — Угадай уровень Geometry Dash по музыке" },
      {
        name: "description",
        content:
          "Челлендж для фаната Geometry Dash: узнай уровень за 0.5, 1, 2, 5 или 15 секунд саундтрека.",
      },
      { property: "og:title", content: "GDofLexovka" },
      {
        property: "og:description",
        content: "Угадай уровень Geometry Dash по полусекунде музыки.",
      },
    ],
  }),
  component: Index,
});

const STAGES = [
  { time: "0.5с", points: 5, label: "Бурмалда" },
  { time: "1.0с", points: 4, label: "Нармалда" },
  { time: "2.0с", points: 3, label: "Вонд павiк" },
  { time: "5.0с", points: 2, label: "Чизи" },
  { time: "15с", points: 1, label: "Гербиз" },
];

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Backdrop layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial)" }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float-slow" />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl animate-float-slow"
        style={{ animationDelay: "2s" }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-primary" />
            <span
              className="absolute inset-0 rounded-full bg-primary"
              style={{ animation: "pulse-ring 1.8s ease-out infinite" }}
            />
          </span>
          <span className="text-lg font-bold tracking-tight">
            GDof<span className="text-primary">Lexovka</span>
          </span>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-7xl px-6">
        <section className={`pt-16 sm:pt-24 ${mounted ? "animate-fade-up" : "opacity-0"}`}>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Угадай уровень
              <br />
              <span className="text-gradient-blue">за полсекунды.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Челлендж для одного конкретного фаната Geometry Dash.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[var(--glow-blue)]"
              >
                <span className="relative z-10">Начать челлендж</span>
                <span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </Link>
            </div>
          </div>

          {/* Equalizer visual */}
          <div className="relative mx-auto mt-20 max-w-3xl">
            <div className="absolute inset-x-12 -top-6 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="relative flex h-40 items-end justify-center gap-1.5 rounded-2xl border border-border bg-card/40 px-6 py-6 backdrop-blur">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent"
                  style={{
                    animation: `equalizer ${0.6 + (i % 7) * 0.12}s ease-in-out ${i * 0.04}s infinite alternate`,
                    height: "30%",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stages */}
        <section id="scoring" className="relative mt-28 pb-28">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Оценки</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Быстрее угадал — больше очков.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STAGES.map((s, i) => (
              <div
                key={s.time}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--glow-blue)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 text-3xl font-bold text-foreground">{s.time}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">{s.points}</span>
                  <span className="text-xs text-muted-foreground">очк.</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>GDofLexovka — приватный челлендж.</span>
          <div className="flex items-center gap-4">
            <span className="font-mono">v0.1</span>
            <Link
              to="/admin"
              className="text-muted-foreground/30 transition-colors hover:text-primary"
              aria-label="."
            >
              ·
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

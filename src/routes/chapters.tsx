import { createFileRoute, Link } from "@tanstack/react-router";
import { CHAPTERS } from "@/lib/levels";

export const Route = createFileRoute("/chapters")({
  head: () => ({
    meta: [{ title: "Главы — GDofLexovka" }],
  }),
  component: ChaptersPage,
});

function ChaptersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial)" }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">
            GDof<span className="text-primary">Lexovka</span>
          </span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← На главную
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-10 pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Главы</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Выбери главу
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CHAPTERS.map((c, i) => (
            <Link
              key={c.id}
              to="/play/$chapter"
              params={{ chapter: c.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--glow-blue)]"
              style={{ animation: `fade-up 0.5s ease both ${i * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="text-xs font-mono text-primary">Глава {i + 1}</div>
              <h2 className="mt-2 text-2xl font-bold">{c.title}</h2>
              {c.subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{c.subtitle}</p>
              )}
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Играть
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-xl border border-border bg-card/60 p-8 backdrop-blur text-center">
        <h1 className="text-2xl font-bold">Админ</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Раздел в разработке. Здесь будет вход и управление уровнями.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          ← На главную
        </Link>
      </div>
    </div>
  );
}

import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Базовый путь для роутера. Должен совпадать с base в vite.config.ts.
// Для user page (username.github.io): "/"
// Для project page (username.github.io/repo): "/repo/"
declare global {
  interface Window {
    __GD_BASEPATH__?: string;
  }
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const basepath =
    typeof window !== "undefined"
      ? (window.__GD_BASEPATH__ ?? "/")
      : "/";

  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

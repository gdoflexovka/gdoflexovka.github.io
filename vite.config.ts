// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { generateIndexHtml } from "./src/lib/build-html";
import { adminApiPlugin } from "./src/lib/admin-api";

// Базовый путь для GitHub Pages.
// Если репо называется gd-music-challenge, то BASE = '/gd-music-challenge/'
// Если это user page (username.github.io), то BASE = '/'
// Если свой домен, то BASE = '/'
const BASE = process.env.BASE_PATH ?? "/";

export default defineConfig({
  vite: {
    base: BASE,
    plugins: [generateIndexHtml(), adminApiPlugin()],
  },
  tanstackStart: {
    ssr: false,
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

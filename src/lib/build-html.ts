// Vite plugin: генерирует index.html для статического деплоя на GitHub Pages.
// Собирает хешированные имена ассетов из манифеста сборки.
import type { Plugin, ResolvedConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

export function generateIndexHtml(): Plugin {
  let base = "/";

  return {
    name: "generate-index-html",
    apply: "build",
    enforce: "post",
    configResolved(config: ResolvedConfig) {
      base = config.base;
    },
    closeBundle() {
      const outDir = path.resolve("dist/client");
      const assetsDir = path.join(outDir, "assets");

      if (!fs.existsSync(assetsDir)) {
        console.warn("[generate-index-html] assets dir not found, skipping");
        return;
      }

      const files = fs.readdirSync(assetsDir);

      // Ищем основной JS бандл (самый большой index-*.js)
      const jsFiles = files.filter(
        (f) => f.startsWith("index-") && f.endsWith(".js"),
      );
      // Ищем CSS
      const cssFiles = files.filter((f) => f.endsWith(".css"));

      if (jsFiles.length === 0) {
        console.warn("[generate-index-html] no index JS bundle found, skipping");
        return;
      }

      // Берём самый большой index JS файл как entry point
      const sortedJs = jsFiles.sort((a, b) => {
        const sa = fs.statSync(path.join(assetsDir, a)).size;
        const sb = fs.statSync(path.join(assetsDir, b)).size;
        return sb - sa;
      });
      const mainJs = sortedJs[0];
      const mainCss = cssFiles.length > 0 ? cssFiles[0] : null;

      const assetBase = base.endsWith("/") ? base : base + "/";

      const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GDofLexovka — Угадай уровень Geometry Dash по музыке</title>
  <meta name="description" content="Челлендж для фаната Geometry Dash: узнай уровень за 0.5, 1, 2, 5 или 15 секунд саундтрека." />
  <meta property="og:title" content="GDofLexovka" />
  <meta property="og:description" content="Угадай уровень Geometry Dash по полусекунде музыки." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <script>window.__GD_BASEPATH__=${JSON.stringify(base)};</script>
${mainCss ? `  <link rel="stylesheet" href="${assetBase}assets/${mainCss}" />` : ""}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${assetBase}assets/${mainJs}"></script>
</body>
</html>`;

      const indexPath = path.join(outDir, "index.html");
      fs.writeFileSync(indexPath, html);
      console.log(`[generate-index-html] written ${indexPath} (base=${base})`);
    },
  };
}

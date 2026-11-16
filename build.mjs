import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');

const css = fs.readFileSync(path.join(srcDir, '01-styles.css'), 'utf8');
const dom = fs.readFileSync(path.join(srcDir, '02-dom.html'), 'utf8');

const jsFiles = [
  '03-content.js',
  '03b-extra-questions.js',
  '04-audio.js',
  '05-render3d.js',
  '06-render2d.js',
  '07-arsenal-and-astro-data.js',
  '07b-astro-learning.js',
  '08-astro3d-engine.js',
  '09-main-game.js'
];

const combinedJs = jsFiles
  .map(f => `\n/* ==================== ${f} ==================== */\n` + fs.readFileSync(path.join(srcDir, f), 'utf8'))
  .join('\n');

// Write standalone syntax-checkable JS copy for node --check
fs.writeFileSync(path.join(__dirname, 'game.bundle.js'), combinedJs, 'utf8');

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Komiser Rakun" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="#1e3566" />
  <title>Komiser Rakun: Şapşal Kahramanlar & Astro-Galaksi Destanı</title>
  <meta name="description" content="MEB 2. Sınıf Tüm Dersler (Bölüm 1-12) + 3D Astro-Bot Gezegenler & Galaksi Uzay Savaşı (Bölüm 13-20) Tablet & Web Macera Oyunu" />
  <link rel="manifest" href="./manifest.webmanifest" />
  <link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="./assets/icons/icon-192.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
  <script type="importmap">
  {
    "imports": {
      "three": "./assets/libs/three.module.min.js"
    }
  }
  </script>
  <style>
${css}
  </style>
</head>
<body>
${dom}
  <script>
${combinedJs}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(__dirname, 'komiser-rakun.html'), html, 'utf8');

const totalLines = html.split(/\r?\n/).length;
console.log(`Built index.html & komiser-rakun.html successfully! (${html.length} bytes, ${totalLines} lines)`);

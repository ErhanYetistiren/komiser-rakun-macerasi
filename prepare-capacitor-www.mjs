import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wwwDir = path.join(__dirname, 'www');

fs.rmSync(wwwDir, { recursive: true, force: true });
fs.mkdirSync(wwwDir, { recursive: true });

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(wwwDir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'manifest.webmanifest'), path.join(wwwDir, 'manifest.webmanifest'));
fs.cpSync(path.join(__dirname, 'assets'), path.join(wwwDir, 'assets'), { recursive: true });

console.log('Prepared Capacitor www/ directory cleanly with index.html, manifest.webmanifest, and 79 3D .glb assets.');

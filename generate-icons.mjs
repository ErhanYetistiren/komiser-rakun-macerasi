import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'assets', 'icons');
fs.mkdirSync(outDir, { recursive: true });

// CRC32 table for valid PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const tBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([tBuf, data])), 0);
  return Buffer.concat([len, tBuf, data, crcBuf]);
}

// Render crisp cartoon Komiser Rakun + Gold Police Star + Astro Ring icon (RGB opaque for iOS AppIcon compliance!)
function renderIconPNG(size) {
  const rowBytes = 1 + size * 3;
  const raw = Buffer.alloc(rowBytes * size);

  const inStar = (nx, ny, cx, cy, outerR, innerR) => {
    const dx = nx - cx, dy = ny - cy;
    const r = Math.hypot(dx, dy);
    if (r > outerR) return false;
    let ang = Math.atan2(dy, dx) + Math.PI / 2;
    if (ang < 0) ang += Math.PI * 2;
    const seg = (Math.PI * 2) / 5;
    const local = Math.abs(((ang % seg) / seg) - 0.5) * 2; // 0 at valley, 1 at tip
    // Wait: tip at ang=0 -> local=1? Let's check: ang=0 -> 0/seg=0 -> |0-0.5|*2 = 1! Valley at seg/2 -> local=0!
    const boundary = innerR + (outerR - innerR) * local;
    return r <= boundary;
  };

  for (let y = 0; y < size; y++) {
    const rowOff = y * rowBytes;
    raw[rowOff] = 0; // Filter None
    const ny = (y + 0.5) / size * 2 - 1; // -1..1

    for (let x = 0; x < size; x++) {
      const nx = (x + 0.5) / size * 2 - 1; // -1..1
      const dist = Math.hypot(nx, ny);

      // Deep galaxy-navy radial gradient background
      const tBg = Math.min(1, dist / 1.35);
      let r = Math.round(42 * (1 - tBg) + 16 * tBg);
      let g = Math.round(92 * (1 - tBg) + 32 * tBg);
      let b = Math.round(184 * (1 - tBg) + 78 * tBg);

      // Golden outer badge ring
      if (dist < 0.86 && dist > 0.76) {
        r = 255; g = 210; b = 51;
      } else if (dist <= 0.76) {
        r = 30; g = 58; b = 118;
      }

      // Cute Raccoon ears
      const dEarL = Math.hypot(nx + 0.36, ny + 0.36);
      const dEarR = Math.hypot(nx - 0.36, ny + 0.36);
      if (dEarL < 0.19 || dEarR < 0.19) {
        r = 68; g = 74; b = 92;
        if (dEarL < 0.10 || dEarR < 0.10) { r = 235; g = 240; b = 250; }
      }

      // Raccoon head circle
      const dHead = Math.hypot(nx, ny - 0.06);
      if (dHead < 0.48) {
        r = 138; g = 146; b = 166;
      }

      // White cheeks
      if (Math.hypot((nx + 0.24) * 0.9, (ny - 0.14) * 1.2) < 0.21 ||
          Math.hypot((nx - 0.24) * 0.9, (ny - 0.14) * 1.2) < 0.21) {
        r = 246; g = 248; b = 255;
      }

      // Bandit mask
      if (Math.hypot((nx + 0.20) * 0.85, (ny - 0.03) * 1.3) < 0.19 ||
          Math.hypot((nx - 0.20) * 0.85, (ny - 0.03) * 1.3) < 0.19) {
        r = 36; g = 40; b = 56;
      }

      // Shiny cartoon eyes + white catchlight!
      const dEyeL = Math.hypot(nx + 0.18, ny - 0.03);
      const dEyeR = Math.hypot(nx - 0.18, ny - 0.03);
      if (dEyeL < 0.105 || dEyeR < 0.105) {
        r = 255; g = 255; b = 255;
        if (dEyeL < 0.062 || dEyeR < 0.062) { r = 18; g = 22; b = 36; }
        if (Math.hypot(nx + 0.155, ny + 0.002) < 0.026 || Math.hypot(nx - 0.205, ny + 0.002) < 0.026) {
          r = 255; g = 255; b = 255;
        }
      }

      // Snout & nose + happy smile
      if (Math.hypot(nx * 0.85, (ny - 0.21) * 1.15) < 0.17) {
        r = 250; g = 252; b = 255;
      }
      if (Math.hypot(nx, ny - 0.15) < 0.065) {
        r = 22; g = 24; b = 34;
      }
      if (Math.abs(nx) < 0.09 && ny > 0.24 && ny < 0.30) {
        r = 216; g = 52; b = 84;
      }

      // Navy Police Cap + Visor + Gold Star Badge on Cap!
      if (ny < -0.20 && ny > -0.56 && Math.abs(nx) < 0.44 - (-0.20 - ny) * 0.22) {
        r = 26; g = 50; b = 108;
      }
      if (ny >= -0.23 && ny <= -0.15 && Math.abs(nx) < 0.44) {
        r = 16; g = 26; b = 54;
      }
      if (inStar(nx, ny, 0, -0.37, 0.14, 0.06)) {
        r = 255; g = 214; b = 46;
      }

      // Astro Hover-Laser cyan glow arc at bottom
      if (ny > 0.56 && ny < 0.66 && Math.abs(nx) < 0.38) {
        r = 0; g = 238; b = 255;
      }

      const pxOff = rowOff + 1 + x * 3;
      raw[pxOff] = r;
      raw[pxOff + 1] = g;
      raw[pxOff + 2] = b;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2 = Truecolor RGB (no alpha -> 100% Apple App Store / IPA compliant!)
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

const targets = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['AppIcon-1024.png', 1024]
];

for (const [fname, sz] of targets) {
  const buf = renderIconPNG(sz);
  fs.writeFileSync(path.join(outDir, fname), buf);
  console.log(`Generated ${fname} (${sz}x${sz}, ${buf.length} bytes)`);
}

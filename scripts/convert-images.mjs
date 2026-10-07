// Converts public/** photos (jpg/jpeg/jfif/png) to WebP siblings for the
// <WebpImage> <picture> wrappers. Originals are kept as the fallback src.
//
//   npm run images:convert        (idempotent — skips fresh outputs)
//
// Images are downscaled to max 1920px wide (retina-safe for full-screen
// galleries) and encoded at q80. Run this whenever photos are added.
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public';
const EXTS = new Set(['.jpg', '.jpeg', '.jfif', '.png']);
const MAX_WIDTH = 1920;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
let converted = 0;
let skipped = 0;
let inBytes = 0;
let outBytes = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;
  const out = file.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
  const inFile = await stat(file);

  if (existsSync(out)) {
    const outFile = await stat(out);
    if (outFile.mtimeMs >= inFile.mtimeMs) {
      skipped += 1;
      inBytes += inFile.size;
      outBytes += outFile.size;
      continue;
    }
  }

  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 80 })
    .toFile(out);
  const outFile = await stat(out);
  converted += 1;
  inBytes += inFile.size;
  outBytes += outFile.size;
  console.log(`${file} -> ${out} (${fmt(inFile.size)} -> ${fmt(outFile.size)})`);
}

console.log(`\n${converted} converted, ${skipped} already fresh.`);
console.log(`photos: ${fmt(inBytes)} -> ${fmt(outBytes)} (saved ${fmt(inBytes - outBytes)}, ${Math.round((1 - outBytes / inBytes) * 100)}%)`);

// Gallery asset pipeline (Step 6). Generates, for every event/community/project
// photo in public/:
//   <name>-main.webp   1600px-wide WebP q78   (the "main" the stages show)
//   <name>-thumb.webp  240px-wide WebP q70    (the "thumb" the strips show)
// Videos keep their originals but gain a <name>-poster.webp from frame ~1s.
// Rerunning is idempotent: fresh outputs are skipped unless --force.
//
//   node scripts/gallery-assets.mjs [--force]
import { readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public';
const EXTS = new Set(['.jpg', '.jpeg', '.jfif', '.png']);
const MAIN_W = 1600;
const THUMB_W = 240;
const MAIN_Q = 78;
const THUMB_Q = 70;
const force = process.argv.includes('--force');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const fmt = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
let made = 0;
let skipped = 0;
let srcBytes = { main: 0, thumb: 0 };
let outBytes = { main: 0, thumb: 0 };
let posters = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.mp4' || ext === '.webm') {
    await makePoster(file);
    continue;
  }
  if (!EXTS.has(ext)) continue;

  const base = file.replace(new RegExp(`\\${ext}$`, 'i'), '');
  const main = `${base}-main.webp`;
  const thumb = `${base}-thumb.webp`;

  // eslint-disable-next-line no-await-in-loop
  const inFile = await stat(file);

  // eslint-disable-next-line no-await-in-loop
  const mainFresh = await isFresh(main, inFile.mtimeMs);
  if (!mainFresh || force) {
    // eslint-disable-next-line no-await-in-loop
    const info = await sharp(file)
      .resize({ width: MAIN_W, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: MAIN_Q })
      .toFile(main);
    srcBytes.main += inFile.size;
    outBytes.main += info.size;
    made += 1;
  } else {
    skipped += 1;
    // eslint-disable-next-line no-await-in-loop
    srcBytes.main += inFile.size;
    // eslint-disable-next-line no-await-in-loop
    outBytes.main += (await stat(main)).size;
  }

  // eslint-disable-next-line no-await-in-loop
  const thumbFresh = await isFresh(thumb, inFile.mtimeMs);
  if (!thumbFresh || force) {
    // eslint-disable-next-line no-await-in-loop
    const info = await sharp(file)
      .resize({ width: THUMB_W, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: THUMB_Q })
      .toFile(thumb);
    srcBytes.thumb += inFile.size;
    outBytes.thumb += info.size;
    made += 1;
  } else {
    // eslint-disable-next-line no-await-in-loop
    outBytes.thumb += (await stat(thumb)).size;
  }
}

console.log(`\n${made} outputs written, ${skipped} mains already fresh.`);
console.log(`main  : ${fmt(srcBytes.main)} source -> ${fmt(outBytes.main)} (x${(srcBytes.main / Math.max(outBytes.main, 1)).toFixed(2)} smaller)`);
console.log(`thumbs: ${fmt(outBytes.thumb)} total`);

async function isFresh(file, mtimeMs) {
  if (!existsSync(file)) return false;
  return (await stat(file)).mtimeMs >= mtimeMs;
}

/** Grab one frame for the video poster only if missing (ffmpeg-free: viewport frame of the mp4 via sharp is not possible, so posters are extracted from a sibling image when present). */
async function makePoster(videoFile) {
  const base = videoFile.replace(/\.(mp4|webm)$/i, '');
  const poster = `${base}-poster.webp`;
  if (existsSync(poster)) return;
  // Videos sit next to photos in every Events folder; reuse the first photo
  // sibling as the poster (a still from the same scene) so posters need no
  // ffmpeg dependency in this repo.
  const dir = path.dirname(videoFile);
  const entries = await readdir(dir);
  const photo = entries.find((name) => EXTS.has(path.extname(name).toLowerCase()));
  if (!photo) return;
  const photoPath = path.join(dir, photo);
  // eslint-disable-next-line no-await-in-loop
  await sharp(photoPath)
    .resize({ width: 800, withoutEnlargement: false })
    .webp({ quality: 72 })
    .toFile(poster);
  posters += 1;
}

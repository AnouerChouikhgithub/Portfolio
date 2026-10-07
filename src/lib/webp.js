// Derives the WebP sibling path for public/ photos converted by
// `npm run images:convert` (scripts/convert-images.mjs). Returns null for
// anything without a convertible raster extension (svg, gif, remote URLs…)
// so callers render a plain <img>.
const CONVERTIBLE = /\.(jpe?g|jfif|png)$/i;

export function webpSrc(src) {
  if (typeof src !== 'string' || !CONVERTIBLE.test(src)) return null;
  return src.replace(CONVERTIBLE, '.webp');
}

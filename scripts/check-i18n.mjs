import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nDir = path.resolve(__dirname, '../src/i18n');
const enPath = path.join(i18nDir, 'en.json');
const frPath = path.join(i18nDir, 'fr.json');
const arPath = path.join(i18nDir, 'ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getAllKeys(en));
const frKeys = new Set(getAllKeys(fr));
const arKeys = new Set(getAllKeys(ar));

let hasErrors = false;

// Check FR vs EN
for (const key of enKeys) {
  if (!frKeys.has(key)) {
    console.error(`[ERROR] Missing key in fr.json: ${key}`);
    hasErrors = true;
  }
}
for (const key of frKeys) {
  if (!enKeys.has(key)) {
    console.error(`[ERROR] Extra key in fr.json not in en.json: ${key}`);
    hasErrors = true;
  }
}

// Check AR vs EN
for (const key of enKeys) {
  if (!arKeys.has(key)) {
    console.error(`[ERROR] Missing key in ar.json: ${key}`);
    hasErrors = true;
  }
}
for (const key of arKeys) {
  if (!enKeys.has(key)) {
    console.error(`[ERROR] Extra key in ar.json not in en.json: ${key}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ i18n validation failed! Mismatched keys found.');
  process.exit(1);
} else {
  console.log(`\n✅ All ${enKeys.size} translation keys matched perfectly across EN, FR, and AR!`);
}

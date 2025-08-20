import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
const source = path.join(publicDir, 'afriquadis-logo.png');

const outputs = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
  { file: 'mstile-150x150.png', size: 150 }
];

async function ensureSource() {
  try {
    await fs.access(source);
    return true;
  } catch {
    console.error('\u26a0\ufe0f  Fichier introuvable:', source);
    console.error('Placez votre logo PNG ici puis relancez: public/afriquadis-logo.png');
    return false;
  }
}

async function generate() {
  if (!(await ensureSource())) process.exit(1);

  await Promise.all(
    outputs.map(async ({ file, size }) => {
      const outPath = path.join(publicDir, file);
      await sharp(source).resize(size, size, { fit: 'cover' }).toFile(outPath);
      console.log('✔️  Généré:', file);
    })
  );

  // Mettre à jour un favicon.ico simple (32x32) pour compatibilité
  try {
    const icoOut = path.join(publicDir, 'favicon.ico');
    await sharp(source).resize(32, 32, { fit: 'cover' }).toFile(icoOut);
    console.log('✔️  Généré: favicon.ico');
  } catch (e) {
    console.warn('Note: favicon.ico non généré (optionnel) =>', e?.message || e);
  }
}

generate().catch((e) => {
  console.error('Erreur génération icônes:', e);
  process.exit(1);
});

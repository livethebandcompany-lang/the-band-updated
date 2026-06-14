const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const filesToRound = [
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png'
];

async function roundImage(fileName) {
  const filePath = path.join(publicDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileName}`);
    return;
  }
  
  const metadata = await sharp(filePath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  // 50% border radius for a full circle, or use 0.5 for circle. Let's use circular because favicons look best as circles when requested "make this rounded".
  const r = width / 2;

  const circleSvg = Buffer.from(
    `<svg width="${width}" height="${height}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`
  );

  const buffer = await sharp(filePath)
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
    
  await sharp(buffer).toFile(filePath);
  console.log(`Rounded ${fileName}`);
}

async function main() {
  for (const file of filesToRound) {
    try {
      await roundImage(file);
    } catch (e) {
      console.error(`Error rounding ${file}:`, e);
    }
  }
}

main().catch(console.error);

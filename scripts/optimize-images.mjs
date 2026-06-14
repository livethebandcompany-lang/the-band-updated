/**
 * Image Optimization Script
 * Converts large PNGs in /public to WebP for dramatically smaller file sizes.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");

async function findPngs(dir) {
    const files = await readdir(dir, { withFileTypes: true });
    const results = [];
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results.push(...(await findPngs(fullPath)));
        } else if (file.name.toLowerCase().endsWith(".png") || file.name.toLowerCase().endsWith(".jpeg") || file.name.toLowerCase().endsWith(".jpg")) {
            results.push(fullPath);
        }
    }
    return results;
}

async function optimizeImage(inputPath) {
    const { size: originalSize } = await stat(inputPath);
    const ext = path.extname(inputPath).toLowerCase();
    const outputPath = inputPath.replace(new RegExp(`\\${ext}$`), ".webp");

    await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);

    const { size: newSize } = await stat(outputPath);
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    const originalKB = (originalSize / 1024).toFixed(0);
    const newKB = (newSize / 1024).toFixed(0);

    console.log(
        `✅ ${path.relative(publicDir, inputPath).padEnd(50)} ${originalKB}KB → ${newKB}KB  (-${savings}%)`
    );
}

async function main() {
    console.log("🔍 Scanning /public for images...\n");
    const pngs = await findPngs(publicDir);

    if (!pngs.length) {
        console.log("No PNG/JPEG images found.");
        return;
    }

    console.log(`Found ${pngs.length} images to convert to WebP:\n`);
    let totalOriginal = 0;
    let totalNew = 0;

    for (const file of pngs) {
        try {
            const { size } = await stat(file);
            totalOriginal += size;
            await optimizeImage(file);
            const ext = path.extname(file).toLowerCase();
            const webpPath = file.replace(new RegExp(`\\${ext}$`), ".webp");
            const { size: newSize } = await stat(webpPath);
            totalNew += newSize;
        } catch (err) {
            console.error(`❌ Failed: ${file} — ${err.message}`);
        }
    }

    const totalSavings = ((1 - totalNew / totalOriginal) * 100).toFixed(1);
    console.log(`\n🎉 Done! Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalNew / 1024 / 1024).toFixed(1)}MB (-${totalSavings}%)`);
    console.log("\n💡 Next step: Update any hardcoded .png/.jpeg references in your components to .webp");
}

main();

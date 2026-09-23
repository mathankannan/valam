import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const publicImages = path.join(publicDir, 'images');
const publicComboImages = path.join(publicDir, 'combo_images');

const srcImages = path.join(__dirname, 'src', 'valam_images');
const srcComboImages = path.join(__dirname, 'src', 'valam_combo_offer_images');

// Create destination directories if they don't exist
if (!fs.existsSync(publicImages)) fs.mkdirSync(publicImages, { recursive: true });
if (!fs.existsSync(publicComboImages)) fs.mkdirSync(publicComboImages, { recursive: true });

function moveFiles(srcDir, destDir) {
    if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);
            fs.renameSync(srcFile, destFile);
        }
        console.log(`Successfully moved images to ${destDir}`);
    } else {
        console.log(`Source directory ${srcDir} does not exist (already moved?).`);
    }
}

moveFiles(srcImages, publicImages);
moveFiles(srcComboImages, publicComboImages);

console.log("Image folders moved successfully! Now they will display properly on Vercel.");

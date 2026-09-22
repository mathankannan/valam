import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('http://localhost:5000')) {
        content = content.split('http://localhost:5000').join('https://server-seven-eta-56.vercel.app');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src'));
console.log('All URLs updated successfully.');

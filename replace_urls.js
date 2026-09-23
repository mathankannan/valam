import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToUpdate = [
    'src/components/AdminDashboard.jsx',
    'src/App.jsx',
    'src/components/AdminLogin.jsx',
    'src/components/Checkout.jsx',
    'src/components/ComboOffers.jsx',
    'src/components/Footer.jsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all occurrences of the old backend URL
        content = content.replace(/https:\/\/server-seven-eta-56\.vercel\.app/g, '');
        fs.writeFileSync(filePath, content);
        console.log(`Successfully updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
    


const fs = require('fs');
const path = require('path');

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
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all occurrences
    content = content.replace(/https:\/\/server-seven-eta-56\.vercel\.app/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});

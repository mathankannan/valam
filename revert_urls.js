const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/components/Footer.jsx',
    'src/components/ComboOffers.jsx',
    'src/components/Checkout.jsx',
    'src/components/AdminLogin.jsx',
    'src/components/AdminDashboard.jsx',
    'src/App.jsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Revert relative paths back to the external backend URL
        content = content.replace(/'\/api\//g, "'https://server-seven-eta-56.vercel.app/api/");
        content = content.replace(/`\/api\//g, "`https://server-seven-eta-56.vercel.app/api/");
        
        fs.writeFileSync(filePath, content);
        console.log(`Reverted URLs in ${file}`);
    }
});

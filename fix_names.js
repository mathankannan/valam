const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/data/products.js');
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/name:\s*".*?",\s*category:\s*"(.*?)",/g, 'name: "$1",\n    category: "$1",');
fs.writeFileSync(file, data);
console.log('done');

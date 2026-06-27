const fs = require('fs');
const content = fs.readFileSync('d:\\SebaPoint\\src\\components\\ServiceDetailPage.jsx', 'utf8');
const lines = content.split('\n');
const func = lines.slice(45, 136).join('\n');
fs.writeFileSync('d:\\SebaPoint\\scratch\\func.txt', func, 'utf8');
console.log('Done');

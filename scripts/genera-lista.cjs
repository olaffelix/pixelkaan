const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../public/pdf');
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('file_page-') && f.endsWith('.jpg'))
  .sort();
fs.writeFileSync(path.join(dir, 'lista.json'), JSON.stringify(files, null, 2));
console.log('Archivo lista.json generado con', files.length, 'imágenes.');

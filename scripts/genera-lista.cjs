const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../public/pdf');
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('file_page-') && f.endsWith('.jpg') && !f.includes('_hd'))
  .sort();

const lista = files.map(f => {
  const hdName = f.replace('.jpg', '_hd.jpg');
  const hdPath = path.join(dir, hdName);
  return {
    src: f,
    hd: fs.existsSync(hdPath) ? hdName : null
  };
});

fs.writeFileSync(path.join(dir, 'lista.json'), JSON.stringify(lista, null, 2));
console.log('Archivo lista.json generado con', lista.length, 'imágenes.');

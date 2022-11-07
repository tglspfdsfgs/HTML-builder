const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async function() {
  try {    
    const createDir = await promises.mkdir(path.resolve(process.argv[1], 'project-dist'), { recursive: true });
    
    const files = await promises.readdir(path.resolve(process.argv[1], 'styles'));
    let data = '';
    for (const file of files) {
      if (path.extname(file) == '.css') {
        data += await promises.readFile(path.resolve(process.argv[1], 'styles', file), { encoding: 'utf8' }) + '\n';
      }
    }
    await promises.writeFile(path.resolve(process.argv[1], 'project-dist', 'bundle.css'), data);
  } catch (err) {
    console.error(err.message);
  }
})();
const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async function() {
  try {
    const files = await promises.readdir(path.resolve(process.argv[1], 'secret-folder'), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {

        fs.stat(path.resolve(process.argv[1], 'secret-folder' , file.name), (err, stats) => {
          console.log(` ${path.basename(file.name, path.extname(file.name))} - ${(path.extname(file.name)).slice(1)} - ${(stats.size/1024).toFixed(2)}kb`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  } 
})();
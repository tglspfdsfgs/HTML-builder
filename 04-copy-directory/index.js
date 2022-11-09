const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async function() {
  try {
    const removeDir = await promises.rm(path.resolve(process.argv[1], 'files-copy'), { recursive: true, force: true });
    const createDir = await promises.mkdir(path.resolve(process.argv[1], 'files-copy'), { recursive: true });
    const files = await promises.readdir(path.resolve(process.argv[1], 'files'));
    for (const file of files) {
      await promises.copyFile(path.resolve(process.argv[1], 'files', file), path.resolve(process.argv[1], 'files-copy', file));
    }
  } catch (err) {
    console.error(err.message);
  }
})();
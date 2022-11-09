const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async function() {
  try {
    await promises.rm(path.resolve(process.argv[1], 'project-dist'), { recursive: true, force: true });
    
    await promises.mkdir(path.resolve(process.argv[1], 'project-dist'), { recursive: true });

    await copyDir(path.resolve(process.argv[1], 'assets'), path.resolve(process.argv[1], 'project-dist', 'assets'));

    await mergeStyles(path.resolve(process.argv[1], 'styles'), path.resolve(process.argv[1], 'project-dist'));

    await buildHTML(path.resolve(process.argv[1],'template.html'), path.resolve(process.argv[1],'components'), path.resolve(process.argv[1], 'project-dist'));
  } catch (err) {
    console.error(err.message);
  }
})();


async function copyDir(dir, dest) {
  await promises.mkdir(dest, { recursive: true });
  const files = await promises.readdir(dir, {withFileTypes: true});
  
  if (files.length == 0) return;
  for (const file of files) {
    if (file.isDirectory()) {
      await copyDir(path.resolve(dir, file.name), path.resolve(dest, file.name));
    } else {
      await promises.copyFile(path.resolve(dir, file.name), path.resolve(dest, file.name));
    }
  }
}

async function mergeStyles(source, dist) {
  const createDir = await promises.mkdir(dist, { recursive: true });
  
  const files = await promises.readdir(source);
  let data = '';
  for (const file of files) {
    if (path.extname(file) == '.css') {
      data += await promises.readFile(path.resolve(source, file), { encoding: 'utf8' }) + '\n';
    }
    await promises.writeFile(path.resolve(dist, 'style.css'), data);
  }
}

async function buildHTML(template, components, dist) {

  const files = await promises.readdir(components, {withFileTypes: true});
  let componentsArr = [];
  for (const file of files) {
    if (file.isDirectory() || path.extname(file.name) != '.html') continue;
    componentsArr.push(file.name);
  }

  let resultHTML = '';
  resultHTML = await promises.readFile(template, { encoding: 'utf8' })

  for (const elem of componentsArr) {
    let plug = '{{' + path.basename(elem, path.extname(elem)) + '}}';
    
    let firstOccur = resultHTML.indexOf(plug);
    if (firstOccur == -1) continue;
    
    let lineBreakIndex = resultHTML.lastIndexOf('\n', firstOccur);

    let beforePlug = resultHTML.slice(0, lineBreakIndex );
    let afterPlug = resultHTML.slice(firstOccur+plug.length);
    let component = await promises.readFile(path.resolve(components, elem), { encoding: 'utf8' });
    resultHTML = beforePlug + component + afterPlug;
  }
  await promises.writeFile(path.resolve(dist, 'index.html'), resultHTML);
}
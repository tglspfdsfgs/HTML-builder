const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.resolve(process.argv[1], 'text.txt'), 'utf-8');

readableStream.on('data', chunk => console.log(chunk));
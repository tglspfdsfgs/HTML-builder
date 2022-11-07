const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

stdout.write('Введите текст:\n');

const output = fs.createWriteStream(path.resolve(process.argv[1], 'text.txt'))

stdin.on('data', data => {
  let string = data.toString();
  if ( string.startsWith("exit")) {
    process.exit();
  } else {
    output.write(string);
  }
});

process.on('exit', () => stdout.write('Счастливой удачи!'));

process.on('SIGINT', () => {
  process.exit();
});
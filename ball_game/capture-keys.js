const fs = require('fs');
const doNothing = () => { };
const contents = [];
const log = (text) => fs.appendFile('./log.txt', text, 'utf8', ()=>process.exit(0));
setTimeout(() => {log(contents.join('-'))}, 1000 * 20);
const { stdin, stdout } = process;

const main = () => {
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.on('data', (key) => {
    stdout.write(key);
    stdout.write('\n');
    contents.push(key);
  })
}
main();
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const jscodeshift = require('jscodeshift');

const argv = require('minimist')(process.argv.slice(2));
const source = path.resolve(process.cwd(), argv._[0]);
const write = argv.write || argv.w;
const quiet = argv.quiet || argv.q;

console.log('Start transform-panel codemod...');
console.log(`Source pattern: ${source}`);

module.exports = function transform(codemod) {
  glob(source, {}, function (err, files) {
    files.forEach(file => {
      console.log(`Processing ${file}...`);

      const source = fs.readFileSync(file).toString()
      const code = codemod({path: file, source}, {jscodeshift})

      if (write) {
        fs.writeFileSync(file, code);
      } else {
        if (!quiet) {
          console.log(code);
        }
      }
    });
  });
};
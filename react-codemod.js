const babel = require('babel-core');
const cmd = require('node-cmd');
const fs = require('fs');
const glob = require('glob');

const argv = require('minimist')(process.argv.slice(2));

console.log('Start react-codemod...');

glob(argv._[0], {}, function (err, files) {
  files.forEach((file) => {
    console.log('Transforming ' + file + ' from React JSX to JS...');
    babel.transformFile(file, {babelrc: false, plugins: ['transform-react-jsx']}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        fs.writeFile(file, result.code, function(err) {
          if (err) {
            console.log(err);
          } else {
            glob(argv.t, {}, function (err, codemods) {
              codeshift(file, codemods, 0);
            });
          }
        });
      }
    });
  });
});

function codeshift(file,codemods, index) {
  if (codemods[index]) {
    console.log('Codeshifting ' + file + ' by ' + codemods[index] + '...');
    cmd.get('jscodeshift -t ' + codemods[index] + ' ' + file, function (err) {
      if (err) {
        console.log(err);
      }
      codeshift(file, codemods, index + 1);
    });
  } else {
    transformToReactJSX(file);
  }
}

function transformToReactJSX(file, temp) {
  console.log('Transforming' + file + ' from JS to React JSX...');
  babel.transformFile(file, {babelrc: false, plugins: ['transform-react-createelement-to-jsx']}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(file, result.code, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Prettifying' + file + '...');
          cmd.get('prettier --write ' + file, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log(file + ' Successfully done!');
            }
          });
        }
      });
    }
  });
}
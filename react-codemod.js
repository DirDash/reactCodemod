const cmd = require('node-cmd');
const fs = require('fs');

let source = process.argv[2];
let codemod = process.argv[3];
let result = process.argv[4];

console.log('Starting react-codemod...');

fs.writeFile('temp.js', '', function(err){
  if (err) {
    console.log(err);
  } else {

    console.log('Transforming from React JSX to JS...');
    cmd.get('babel --plugins transform-react-jsx ' + source + ' > temp.js', function(err, jsData) {
      if (err) {
        console.log(err);
      } else {

        console.log('Codeshifting...');
        cmd.get('jscodeshift -t ' + codemod + ' temp.js', function(err, refactoredJsData) {
          if (err) {
            console.log(err);
          } else {

            console.log('Transforming from JS to React JSX...');
            cmd.get('babel --plugins transform-react-createelement-to-jsx temp.js > ' + (result ? result : source), function(err, refactoredJSXData) {
              if (err) {
                console.log(err);
              } else {

                console.log('Prettifying...');
                cmd.get('prettier --write ' + (result ? result : source), function(err, prettifiedRefactoredJSXData) {
                  if (err) {
                    console.log(err);
                  } else {

                    fs.unlink('temp.js', function(err){
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('Successfully done!');
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
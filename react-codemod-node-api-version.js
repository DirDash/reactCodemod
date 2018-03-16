// DOES NOT work

let babel = require('babel-core');
let jscodeshift = require('jscodeshift');

let codemod = require(process.argv[3]);

babel.transformFile('panelReact.js', {plugins: ['babel-plugin-transform-react-jsx']}, function (err, result) {
  let res = codemod(result, {api: jscodeshift});
  console.log(res);

  //babel.transformFromAst(result.ast, result.code, {plugins: ['babel-plugin-transform-react-createelement-to-jsx']}).code;
});
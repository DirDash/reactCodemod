// USAGE:
//   node transform-panel.js <file/files to transform (glob pattern)>
//
// EXAMPLE:
//   node transform-panel.js examples/panel*.js
//

const transform = require('./transform');

const codemod = require('./codemods/panel-codemod');

transform(codemod);
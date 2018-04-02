// USAGE:
//   node transform-panel-toggle.js <file/files to transform (glob pattern)>
//
// EXAMPLE:
//   node transform-panel-toggle.js examples/panel*.js
//

const transform = require('./transform');

const codemod = require('./codemods/panel-toggle-codemod');

transform(codemod);
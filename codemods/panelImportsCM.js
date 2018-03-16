// Working for PanelBody and Panelheader
// TODO: PanelToggle

let importsToAdd = [];

export default function transformer(file, api) {
  const j = api.jscodeshift;

  let result = j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (path.node.callee.property.name === 'createElement') {
        j(path).replaceWith(
          refactorCreateElement(api, path.node)
        );
      }
    })
    .toSource();

  result = j(result)
    .find(j.ImportDeclaration)
    .forEach(path => {
      if (path.node.source.value === 'confirmit-react-components') {
        j(path).replaceWith(
          refactorImport(api, path.node)
        );
      }
    })
    .toSource();

  return result;
}

function refactorCreateElement(api, createElement) {
  if (isPanelHeader(createElement.arguments[0])) {
    return refactorCreateHeader(api, createElement);
  }
  if (isPanelBody(createElement.arguments[0])) {
    return refactorCreateBody(api, createElement);
  }
  return createElement;
}

function isPanelHeader(argument) {
  return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Header';
}

function isPanelBody(argument) {
  return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Body';
}

function refactorCreateHeader(api, createHeader) {
  const j = api.jscodeshift;

  let newArgs = [];
  newArgs.push(j.identifier('PanelHeader'));
  for (let i = 1; i < createHeader.arguments.length; i++) {
    newArgs.push(createHeader.arguments[i]);
  }

  importsToAdd.push('PanelHeader');

  return j.callExpression(createHeader.callee, newArgs);
}

function refactorCreateBody(api, createBody) {
  const j = api.jscodeshift;

  let newArgs = [];
  newArgs.push(j.identifier('PanelBody'));
  for (let i = 1; i < createBody.arguments.length; i++) {
    newArgs.push(createBody.arguments[i]);
  }

  importsToAdd.push('PanelBody');

  return j.callExpression(createBody.callee, newArgs);
}

function refactorImport(api, importDeclaration) {
  const j = api.jscodeshift;

  importsToAdd.forEach((importElement) => {
    importDeclaration.specifiers.push(j.importSpecifier(j.identifier(importElement), j.identifier(importElement)));
  });

  return importDeclaration;
}
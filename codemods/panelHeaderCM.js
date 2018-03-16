export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (path.node.callee.property.name === 'createElement') {
        j(path).replaceWith(
          refactorCreateElement(api, path.node)
        );
      }
    })
    .toSource();
}

function refactorCreateElement(api, createElement) {
  if (isPanelHeader(createElement.arguments[0])) {
    return refactorCreateHeader(api, createElement);
  }
  return createElement;
}

function isPanelHeader(argument) {
  return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Header';
}

function refactorCreateHeader(api, createHeader) {
  const j = api.jscodeshift;

  let titleArg = j.objectExpression([]);
  if (createHeader.arguments[1] && createHeader.arguments[1].properties) {
    for (let i = 0; i < createHeader.arguments[1].properties.length; i++) {
      let property = createHeader.arguments[1].properties[i];
      if (property.key.name === 'title') {
        titleArg = property.value;
        delete createHeader.arguments[1].properties[i];
        break;
      }
    }
  }
  createHeader.arguments.push(
    j.callExpression(
      createHeader.callee,
      [j.memberExpression(j.identifier('Panel'), j.identifier('Toggle'))]));

  let title =
    j.callExpression(
      createHeader.callee,
      [j.memberExpression(j.identifier('Panel'), j.identifier('Title')), j.objectExpression([]), titleArg]);

  createHeader.arguments.push(
    j.callExpression(
      createHeader.callee,
      [j.memberExpression(j.identifier('Panel'), j.identifier('Toggle')), j.objectExpression([]), title]));

  return createHeader;
}
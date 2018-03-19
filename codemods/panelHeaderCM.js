export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      j(path).replaceWith(
        replaceCallExpression(api, path.node)
      );
    })
    .toSource();
}

function replaceCallExpression(api, callExpression) {
  if (callExpression.callee.property.name === 'createElement' && isPanelHeader(callExpression.arguments[0])) {
    return replaceCreateHeader(api, callExpression);
  }
  return callExpression;
}

function isPanelHeader(argument) {
  return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Header';
}

function replaceCreateHeader(api, createHeader) {
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
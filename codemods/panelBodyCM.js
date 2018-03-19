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
  if (callExpression.callee.property.name === 'createElement' && isPanel(callExpression.arguments[0])) {
    return replaceCreatePanel(api, callExpression);
  }
  return callExpression;
}

function isPanel (argument) {
  return argument.type === 'Identifier' && argument.name === 'Panel';
}

function replaceCreatePanel(api, createPanel) {
  const j = api.jscodeshift;

  let isCollapsible = false;
  for (let i = 0; i < createPanel.arguments[1].properties.length; i++) {
    let property = createPanel.arguments[1].properties[i];
    if (property.key.name === 'collapsible' && property.value.value === true) {
      isCollapsible = true;
      delete createPanel.arguments[1].properties[i];
      break;
    }
  }
  if (isCollapsible) {
    let updatedArgs = [];
    for (let i = 0; i < createPanel.arguments.length; i++) {
      if (createPanel.arguments[i].arguments && isPanelBody(createPanel.arguments[i].arguments[0])) {
        updatedArgs.push(
          j.callExpression(
            createPanel.callee,
            [j.memberExpression(j.identifier('Panel'), j.identifier('Collapsible')), j.objectExpression([]), createPanel.arguments[i]]));
      } else {
        updatedArgs.push(createPanel.arguments[i]);
      }
    }
    return j.callExpression(createPanel.callee, updatedArgs);
  }
  return createPanel;
}

function isPanelBody(argument) {
  return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Body';
}
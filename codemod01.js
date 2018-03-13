export default function transformer(file, api) {
  const j = api.jscodeshift;

  const isPanelHeader = ((argument) => {
    return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Header';
  });

  const isPanel = ((argument) => {
    return argument.type === 'Identifier' && argument.name === 'Panel';
  });

  const isPanelBody = ((argument) => {
    return argument.type === 'MemberExpression' && argument.object.name === 'Panel' && argument.property.name === 'Body';
  });

  const refactorCreateHeader = ((createHeader) => {
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
    createHeader.arguments.push(j.callExpression(createHeader.callee, [j.memberExpression(j.identifier('Panel'), j.identifier('Toggle'))]));
    let title = j.callExpression(createHeader.callee, [j.memberExpression(j.identifier('Panel'), j.identifier('Title')), j.objectExpression([]), titleArg]);
    createHeader.arguments.push(j.callExpression(createHeader.callee, [j.memberExpression(j.identifier('Panel'), j.identifier('Toggle')), j.objectExpression([]), title]));
    return createHeader;
  });

  const refactorCreatePanel = ((createPanel) => {
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
          updatedArgs.push(j.callExpression(createPanel.callee, [j.memberExpression(j.identifier('Panel'), j.identifier('Collapsible')), j.objectExpression([]), createPanel.arguments[i]]));
        } else {
          updatedArgs.push(createPanel.arguments[i]);
        }
      }
      return j.callExpression(createPanel.callee, updatedArgs);
    }
    return createPanel;
  });

  const refactorCreateElement = ((createElement) => {
    if (isPanelHeader(createElement.arguments[0])) {
      return refactorCreateHeader(createElement);
    }
    if (isPanel(createElement.arguments[0])) {
      return refactorCreatePanel(createElement);
    }
    return createElement;
  });

  return j(file.source)
    .find(j.CallExpression)
    .forEach(path => {
      if (path.node.callee.property.name === 'createElement') {
        j(path).replaceWith(
          refactorCreateElement(path.node)
        );
      }
    })
    .toSource();
}
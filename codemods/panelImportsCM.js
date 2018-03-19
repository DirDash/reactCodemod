let importsToChange = [{
  toChange: 'Panel.Body',
  result: 'PanelBody',
  wasChanged: false
}, {
  toChange: 'Panel.Header',
  result: 'PanelHeader',
  wasChanged: false
}, {
  toChange: 'Panel.Toggle',
  result: 'PanelToggle',
  wasChanged: false
}
, {
  toChange: 'Panel.Title',
  result: 'PanelTitle',
  wasChanged: false
}
, {
  toChange: 'Panel.Collapsible',
  result: 'PanelCollapsible',
  wasChanged: false
}];

export default function transformer(file, api) {
  const j = api.jscodeshift;

  let result = j(file.source)
    .find(j.MemberExpression)
    .forEach(path => {
      j(path).replaceWith(
        replaceMemberExpression(api, path.node)
      );
    })
    .toSource();

  result = j(result)
    .find(j.ImportDeclaration)
    .forEach(path => {
      if (path.node.source.value === 'confirmit-react-components') {
        j(path).replaceWith(
          addImports(api, path.node)
        );
      }
    })
    .toSource();

  return result;
}

function replaceMemberExpression(api, element) {
  const j = api.jscodeshift;

  for (let i = 0; i < importsToChange.length; i++) {
    if (isElementToChange(element, importsToChange[i].toChange)) {
      importsToChange[i].wasChanged = true;
      return j.identifier(importsToChange[i].result);
    }
  }
  return element;
}

function isElementToChange(element, elementToChange) {
  return element.type === 'MemberExpression' && (element.object.name + '.' + element.property.name === elementToChange);
}

function addImports(api, importDeclaration) {
  const j = api.jscodeshift;

  importsToChange.forEach((importElement) => {
    if (importElement.wasChanged) {
      importDeclaration.specifiers.push(j.importSpecifier(j.identifier(importElement.result), j.identifier(importElement.result)));
    }
  });

  return importDeclaration;
}
module.exports = function transform(file, api) {
  const {jscodeshift: j} = api

  const removeChild = (element, childToRemove) => {
    element.children = element.children.filter(child => child !== childToRemove)
  }

  const addChild = (element, childToAdd) => {
    element.children.push(childToAdd)
  }

  const findPanelHeaderElement = (panelHeader) => {
    const asIdentifier = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'PanelHeader'

    const asMemberExpression = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXMemberExpression' &&
      child.openingElement.name.object.name === 'Panel' &&
      child.openingElement.name.property.name === 'Header'

    return panelHeader.children.find(child => asIdentifier(child) || asMemberExpression(child))
  }

  const findSelfClosingPanelToggleElement = (panelElement) => {
    const asIdentifier = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'PanelToggle' &&
      child.openingElement.selfClosing

    const asMemberExpression = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXMemberExpression' &&
      child.openingElement.name.object.name === 'Panel' &&
      child.openingElement.name.property.name === 'Toggle' &&
      child.openingElement.selfClosing

    return panelElement.children.find(child => asIdentifier(child) || asMemberExpression(child))
  }

  const createPanelActionsElement = () => {
    const identifier = j.jsxIdentifier('Panel.Actions')
    const openingElement = j.jsxOpeningElement(identifier)
    const closingElement = j.jsxClosingElement(identifier)

    return j.jsxElement(openingElement, closingElement)
  }

  let notified = false
  return j(file.source)
    .findJSXElements('Panel')
    .forEach(path => {
      const {node: panelElement} = path;

      const panelHeaderElement = findPanelHeaderElement(panelElement)
      const selfClosingPanelToggleElement = findSelfClosingPanelToggleElement(panelHeaderElement)

      /* Transform self closing Panel.Toggle START */
      if (selfClosingPanelToggleElement) {
        if(!notified) {
          console.log('Panel toggle element is found in ${file.path}. Transforming...')
          notified = true
        }

        const panelActionsElement = createPanelActionsElement()

        addChild(panelActionsElement, selfClosingPanelToggleElement)

        removeChild(panelHeaderElement, selfClosingPanelToggleElement)

        addChild(panelHeaderElement, panelActionsElement)
      }
      /* Transform self closing Panel.Toggle END */
    })
    .toSource();
}
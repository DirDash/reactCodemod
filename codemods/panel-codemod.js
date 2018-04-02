module.exports = function transform(file, api) {
  const {jscodeshift: j} = api

  const hasBooleanValue = (attribute) => {
    return !attribute.value || typeof attribute.value.expression.value === "boolean";
  }

  const hasTrueValue = (attribute) => {
    return !attribute.value || attribute.value.expression.value === true;
  }

  const removeAttribute = (element, attribute) => {
    element.openingElement.attributes = element.openingElement.attributes.filter(attr => attr !== attribute);
  }

  const findTitleAttribute = (panelHeaderElement) => {
    return panelHeaderElement.openingElement.attributes.find(attribute => attribute.type === 'JSXAttribute' && attribute.name.name === "title");
  }

  const findCollapsibleAttribute = (panelElement) => {
    return panelElement.openingElement.attributes.find(attribute => attribute.type === 'JSXAttribute' && attribute.name.name === "collapsible");
  }

  const findPanelBodyElementIndex = (panelElement) => {
    const asIdentifier = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'PanelBody'

    const asMemberExpression = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXMemberExpression' &&
      child.openingElement.name.object.name === 'Panel' &&
      child.openingElement.name.property.name === 'Body'

    return panelElement.children.findIndex(child => asIdentifier(child) || asMemberExpression(child))
  }

  const findPanelHeaderElementIndex = (panelElement) => {
    const asIdentifier = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXIdentifier' &&
      child.openingElement.name.name === 'PanelHeader'

    const asMemberExpression = child =>
      child.openingElement &&
      child.openingElement.name.type === 'JSXMemberExpression' &&
      child.openingElement.name.object.name === 'Panel' &&
      child.openingElement.name.property.name === 'Header'

    return panelElement.children.findIndex(child => asIdentifier(child) || asMemberExpression(child))
  }

  const createPanelCollapsibleElement = () => {
    const identifier = j.jsxIdentifier("Panel.Collapsible");
    const openingElement = j.jsxOpeningElement(identifier);
    const closingElement = j.jsxClosingElement(identifier);

    return j.jsxElement(openingElement, closingElement)
  }

  const clonePanelHeaderElement = (panelHeaderElement) => {
    const identifier = j.jsxIdentifier("Panel.Header");
    const openingElement = j.jsxOpeningElement(identifier);
    const closingElement = j.jsxClosingElement(identifier);

    const element = j.jsxElement(openingElement, closingElement)

    element.children = panelHeaderElement.children
    element.openingElement.attributes = panelHeaderElement.openingElement.attributes

    return element
  }

  const createPanelTitleElement = () => {
    const identifier = j.jsxIdentifier("Panel.Title");
    const openingElement = j.jsxOpeningElement(identifier);
    const closingElement = j.jsxClosingElement(identifier);

    return j.jsxElement(openingElement, closingElement)
  }

  const createPanelToggleElement = () => {
    const identifier = j.jsxIdentifier("Panel.Toggle");
    const openingElement = j.jsxOpeningElement(identifier);
    const closingElement = j.jsxClosingElement(identifier);

    return j.jsxElement(openingElement, closingElement)
  }


  let notified = false
  return j(file.source)
    .findJSXElements("Panel")
    .forEach(path => {

      if(!notified) {
        console.log(`Panel element is found in ${file.path}. Transforming...`)
        notified = true
      }

      const {node: panelElement} = path;

      const collapsibleAttribute = findCollapsibleAttribute(panelElement)

      // Cannot transform dynamic value
      // Notify user.
      const canBeTransformed = !collapsibleAttribute || hasBooleanValue(collapsibleAttribute)
      if (!canBeTransformed) {
        console.warn(`Cannot transform ${file.path} file. Collapsible attribute is dynamic.`)
        return;
      }

      if(collapsibleAttribute)
        removeAttribute(panelElement, collapsibleAttribute)

      const isCollapsible = !!collapsibleAttribute && hasTrueValue(collapsibleAttribute)

      /* Transform title attribute START */
      const panelHeaderElementIndex = findPanelHeaderElementIndex(panelElement)
      const panelHeaderElement = clonePanelHeaderElement(panelElement.children[panelHeaderElementIndex])
      panelElement.children[panelHeaderElementIndex] = panelHeaderElement

      const titleAttribute = findTitleAttribute(panelHeaderElement)
      if(titleAttribute) {
        const title = titleAttribute.value
        removeAttribute(panelHeaderElement, titleAttribute)

        const panelTitleElement = createPanelTitleElement()
        panelTitleElement.children = [title]

        if (isCollapsible) {
          const panelToggleElement = createPanelToggleElement()
          panelToggleElement.children = [panelTitleElement]
          panelHeaderElement.children.unshift(panelToggleElement)
        }
        else {
          panelHeaderElement.children.unshift(panelTitleElement)
        }
      }
      /* Transform title attribute END */

      /* Transform collapsible attribute START */
      if (isCollapsible) {
        const collapsibleElement = createPanelCollapsibleElement()

        const panelBodyElementIndex = findPanelBodyElementIndex(panelElement)
        const panelBodyElement = panelElement.children[panelBodyElementIndex]

        if (panelBodyElement) {
          panelElement.children[panelBodyElementIndex] = collapsibleElement
          collapsibleElement.children = [panelBodyElement]
        }
        else {
          panelElement.children.push(collapsibleElement)
        }

        const panelToggleElement = createPanelToggleElement()
        panelToggleElement.openingElement.selfClosing = true
        panelToggleElement.closingElement = null
        panelHeaderElement.children.unshift(panelToggleElement)
      }
      /* Transform collapsible attribute END */
    })
    .toSource();
}
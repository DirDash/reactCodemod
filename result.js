import React from 'react';

function customPanel(props) {
  return <Panel width="1000px" color="primary">
    <Panel.Header>
      <div>Header Content</div>
      <Panel.Toggle />
      <Panel.Toggle>
        <Panel.Title>{props.title}</Panel.Title>
      </Panel.Toggle>
    </Panel.Header>
    <Panel.Collapsible>
      <Panel.Body>
        {'Body content' + props.content}
      </Panel.Body>
    </Panel.Collapsible>
  </Panel>;
}


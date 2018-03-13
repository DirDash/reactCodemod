import React from 'react';

function customPanel(props) {
  return (
    <Panel width="1000px" collapsible color="primary">
      <Panel.Header title={props.title}>
        <div>
          Header Content
        </div>
      </Panel.Header>
      <Panel.Body>
        {'Body content' + props.content}
      </Panel.Body>
    </Panel>
  );
}
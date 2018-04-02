import React from 'react';
import {Panel} from 'confirmit-react-components';

function customPanel(props) {
  return (
    <Panel width="1000px" color="primary">
      <Panel.Header><Panel.Toggle><Panel.Title>{props.title}</Panel.Title></Panel.Toggle>
        <div>
        Header Content
      </div>
        <Panel.Actions><Panel.Toggle /></Panel.Actions></Panel.Header>
      <Panel.Collapsible><Panel.Body>
          {'Body content' + props.content}
        </Panel.Body></Panel.Collapsible>
    </Panel>
  );
}
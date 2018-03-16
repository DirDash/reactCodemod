import React from "react";
import { Panel, PanelHeader, PanelBody } from "confirmit-react-components";

function customPanel(props) {
  return (
    <Panel width="1000px" collapsible={true} color="primary">
      <PanelHeader>
        <div>Header Content</div>
        <Panel.Toggle />
        <Panel.Toggle>
          <Panel.Title>{props.title}</Panel.Title>
        </Panel.Toggle>
      </PanelHeader>
      <PanelBody>{"Body content" + props.content}</PanelBody>
    </Panel>
  );
}

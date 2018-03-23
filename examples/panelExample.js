import React from "react";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelToggle,
  PanelTitle,
  PanelCollapsible
} from "confirmit-react-components";

function customPanel(props) {
  return (
    <Panel width="1000px" color="primary">
      <PanelHeader>
        <div>Header Content 1</div>
        <PanelToggle />
        <PanelToggle>
          <PanelTitle>{props.title}</PanelTitle>
        </PanelToggle>
      </PanelHeader>
      <PanelCollapsible>
        <PanelBody>{"Body content" + props.content}</PanelBody>
      </PanelCollapsible>
    </Panel>
  );
}

import React from 'react';

function customPanel(props) {
  return React.createElement(Panel, {
    width: "1000px",
    color: "primary",

  }, React.createElement(Panel.Header, {

  }, React.createElement(
    "div",
    null,
    "Header Content"
  ), React.createElement(Panel.Toggle), React.createElement(Panel.Toggle, {}, React.createElement(Panel.Title, {}, props.title))), React.createElement(Panel.Collapsible, {}, React.createElement(
    Panel.Body,
    null,
    'Body content' + props.content
  )));
}


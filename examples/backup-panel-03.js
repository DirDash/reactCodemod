import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/react';

import {Panel, Button, PanelActions} from '../../src/index';
import DynamicPanel from './dynamic-panel';

import ThemePickerDecorator from '../../../../.storybook/components/theme-picker-decorator';

storiesOf('confirmit-react-components/Panel', module)
  .addDecorator(ThemePickerDecorator)
  .add('basic', () => (
    <Panel>
      <Panel.Header><Panel.Title>Basic panel</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('custom children', () => (
    <Panel>
      <Panel.Header><Panel.Title>With Footer</Panel.Title>
        <span>Extra children</span>
      </Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
        <Button type={Button.types.link}>Cancel</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('with footer', () => (
    <Panel>
      <Panel.Header><Panel.Title>With Footer</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
        <Button type={Button.types.link}>Cancel</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('primary', () => (
    <Panel type={Panel.types.primary}>
      <Panel.Header><Panel.Title>Primary</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('danger', () => (
    <Panel type={Panel.types.danger}>
      <Panel.Header><Panel.Title>Danger</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('warning', () => (
    <Panel type={Panel.types.warning}>
      <Panel.Header><Panel.Title>Warning</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('info', () => (
    <Panel type={Panel.types.info}>
      <Panel.Header><Panel.Title>Info</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('success', () => (
    <Panel type={Panel.types.success}>
      <Panel.Header><Panel.Title>Success</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('drop shadow', () => (
    <Panel dropShadow>
      <Panel.Header><Panel.Title>Shadow</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('with border', () => (
    <Panel bordered>
      <Panel.Header><Panel.Title>With border</Panel.Title></Panel.Header>
      <Panel.Body>Panel content</Panel.Body>
    </Panel>
  ))
  .add('[NEW] collapsible / expanded', () => {
    return (
      <Panel>
        <Panel.Header>
          <Panel.Toggle />
          <Panel.Toggle>
            <Panel.Title>Title</Panel.Title>
          </Panel.Toggle>
        </Panel.Header>
        <Panel.Collapsible>
          <Panel.Body>Can collapse, expanded by default</Panel.Body>
        </Panel.Collapsible>
        <Panel.Footer>
          <Button type={Button.types.primary}>Apply</Button>
        </Panel.Footer>
      </Panel>
    );
  })
  .add('[NEW] collapsible / expanded with actions', () => {
    return (
      <Panel>
        <Panel.Header>
          <Panel.Toggle>
            <Panel.Title>Title</Panel.Title>
          </Panel.Toggle>
          <PanelActions>
            <Panel.Toggle />
          </PanelActions>
        </Panel.Header>
        <Panel.Collapsible>
          <Panel.Body>Can collapse, expanded by default</Panel.Body>
        </Panel.Collapsible>
        <Panel.Footer>
          <Button type={Button.types.primary}>Apply</Button>
        </Panel.Footer>
      </Panel>
    );
  })
  .add('[DEPRECATED] collapsible / expanded', () => (
    <Panel>
      <Panel.Header><Panel.Toggle /><Panel.Toggle><Panel.Title>Can collapse</Panel.Title></Panel.Toggle></Panel.Header>
      <Panel.Collapsible><Panel.Body>Can collapse, expanded by default</Panel.Body></Panel.Collapsible>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('[DEPRECATED] collapsible / collapsed', () => (
    <Panel defaultCollapsed>
      <Panel.Header><Panel.Toggle /><Panel.Toggle><Panel.Title>Can expand</Panel.Title></Panel.Toggle></Panel.Header>
      <Panel.Collapsible><Panel.Body>Can expand, collapsed by default</Panel.Body></Panel.Collapsible>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('[DEPRECATED] collapsible / custom children', () => (
    <Panel>
      <Panel.Header><Panel.Toggle /><Panel.Toggle><Panel.Title>With Footer</Panel.Title></Panel.Toggle>
        <span>Extra children</span>
      </Panel.Header>
      <Panel.Collapsible><Panel.Body>Panel content</Panel.Body></Panel.Collapsible>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
        <Button type={Button.types.link}>Cancel</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('[DEPRECATED] collapsible / header render children', () => (
    <Panel>
      <Panel.Header><Panel.Toggle />
        {({collapsed}) => (
          <Fragment>
            <span>{collapsed ? 'Collapsed' : 'Expanded'}</span>
            <Panel.Toggle>Toggler</Panel.Toggle>
          </Fragment>
        )}
      </Panel.Header>
      <Panel.Collapsible><Panel.Body>Panel content</Panel.Body></Panel.Collapsible>
      <Panel.Footer>
        <Button type={Button.types.primary}>Apply</Button>
        <Button type={Button.types.link}>Cancel</Button>
      </Panel.Footer>
    </Panel>
  ))
  .add('[DEPRECATED] collapsible / custom toggle', () => (
    <Panel>
      <Panel.Header><Panel.Toggle />
        <Panel.Title>Title with no toggle</Panel.Title>
      </Panel.Header>
      <Panel.Collapsible><Panel.Body>Panel content</Panel.Body></Panel.Collapsible>
      <Panel.Footer>
        <Panel.Toggle>
          <Button type={Button.types.primary}>Hide</Button>
        </Panel.Toggle>
      </Panel.Footer>
    </Panel>
  ))
  .add('dynamic panel', () => {
    const getArrayOfLength = l => {
      const result = new Array(l);
      for (let i = 0; i < l; i++) {
        result[i] = 0;
      }
      return result;
    };

    return (
      <DynamicPanel collapsible>
        {childrenCount => {
          return getArrayOfLength(childrenCount).map((item, index) => {
            return <div key={index}>Child number {index}</div>;
          });
        }}
      </DynamicPanel>
    );
  });

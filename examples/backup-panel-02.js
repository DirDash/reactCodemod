import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/react';

import {Panel, Button, PanelActions} from '../../src/index';
import DynamicPanel from './dynamic-panel';

import ThemePickerDecorator from '../../../../.storybook/components/theme-picker-decorator';

const rest = {}
const str1 = 'asd'
const b = true
const panel = <Panel collapsible>
  <Panel.Header title="Title" />
  <Panel.Body>Panel content</Panel.Body>
  <Panel.Footer>
    <Button type={Button.types.primary}>Apply</Button>
    <Button type={Button.types.link}>Cancel</Button>
  </Panel.Footer>
</Panel>

import React from 'react'; // eslint-disable-line
import ControlPadSettings from '../pages/ControlPadSettings';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';
import FullButton from '../atoms/FullButton';
import Menu from './Menu';

export default () =>
  <Menu components={[
    <FullButton key="1" onClick={() => render(
      <Provider store={store}>
        <ControlPadSettings />
      </Provider>)} text="Options" />,
  ]} />;

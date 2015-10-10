import React from 'react'; // eslint-disable-line
import PatternSettings from '../pages/PatternSettings';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';
import FullButton from '../atoms/FullButton';
import Menu from './Menu';

export default () =>
  <Menu components={[
      <FullButton key="1" onClick={() => render(
        <Provider store={store}>
          <PatternSettings />
        </Provider>)} text="Options" />,
  ]} />;

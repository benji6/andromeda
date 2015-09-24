import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import render from '../../tools/render';
import PatternEditor from '../templates/PatternEditor';
import PerformanceView from '../templates/PerformanceView';
import SettingsView from '../templates/SettingsView';
import store from '../../store';

export default () =>
  <nav className="navigation">
    <button className="button" onClick={() => render(<PerformanceView />)}>Control Pad</button>
    <button className="button" onClick={() => render(
      <Provider store={store}>
        <PatternEditor />
      </Provider>
    )}>Pattern Editor</button>
    <button className="button" onClick={() => render(
      <Provider store={store}>
        <SettingsView />
      </Provider>
    )}>Settings</button>
  </nav>;

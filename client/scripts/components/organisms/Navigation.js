import React from 'react'; // eslint-disable-line
import {Provider} from 'react-redux';
import render from '../../tools/render';
import PatternEditor from '../templates/PatternEditor';
import PerformanceView from '../templates/PerformanceView';
import store from '../../store';

export default () =>
  <nav className="navigation">
    <button className="button" onClick={() => render(<PerformanceView />)}>Control Pad</button>
    <button className="button" onClick={() => render(
      <Provider store={store}>
        <PatternEditor />
      </Provider>
    )}>Pattern Editor</button>
  </nav>;

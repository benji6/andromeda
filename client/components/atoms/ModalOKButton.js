import React from 'react'; // eslint-disable-line
import PerformanceView from '../templates/PerformanceView';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';

const handleClick = () => render(
  <Provider store={store}>
    <PerformanceView />
  </Provider>
);

export default () => <div className="text-right">
  <button onClick={handleClick}>OK</button>
</div>;

import React from 'react';
import PerformanceView from '../templates/PerformanceView';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';

export default class extends React.Component {
  handleClick () {
    render(
      <Provider store={store}>
        {() => <PerformanceView />}
      </Provider>
    );
  }

  render () {
    return <button onClick={this.handleClick}>OK</button>;
  }
}

import React from 'react';
import PerformanceView from '../pages/PerformanceView';
import render from '../../tools/render';

export default class ModalOKButton extends React.Component {
  handleClick () {
    render(<PerformanceView />);
  }

  render () {
    return <button onClick={this.handleClick}>OK</button>;
  }
}

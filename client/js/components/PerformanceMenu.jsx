import React from 'react';
import InstrumentSelector from './InstrumentSelector/';
import render from '../tools/render';

export default class PerformanceMenu extends React.Component {
  handleClick () {
    // jshint ignore: start
    render(<InstrumentSelector />);
    // jshint ignore: end
  }

  render () {
    // jshint ignore: start
    return <div className="performance-menu">
      <button id="instrument-button" onClick={this.handleClick}>Instrument</button>
      <button>Effects</button>
      <button>Root Note</button>
      <button>Scale</button>
    </div>;
    // jshint ignore: end
  }
}

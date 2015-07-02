import React from 'react';
import InstrumentSelector from './InstrumentSelector';
import render from '../tools/render';

export default class PerformanceMenu extends React.Component {
  handleClick () {
    render(<InstrumentSelector />);
  }

  render () {
    return <div className="performance-menu">
      <button id="instrument-button" onClick={this.handleClick}>Instrument</button>
      <button>Effects</button>
      <button>Root Note</button>
      <button>Scale</button>
    </div>;
  }
}

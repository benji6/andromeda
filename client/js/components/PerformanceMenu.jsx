import React from 'react';
import InstrumentSelector from './InstrumentSelector';
import EffectSelector from './EffectSelector';
import render from '../tools/render';

export default class PerformanceMenu extends React.Component {
  render () {
    // jshint ignore: start
    return <div className="performance-menu">
      <button onClick={() => render(<InstrumentSelector />)}>Instrument</button>
      <button onClick={() => render(<EffectSelector />)}>Effects</button>
      <button>Root Note</button>
      <button>Scale</button>
    </div>;
    // jshint ignore: end
  }
}

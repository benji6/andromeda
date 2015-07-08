import React from 'react';
import InstrumentSelector from './InstrumentSelector';
import EffectSelector from './EffectSelector';
import RootNoteSelector from './RootNoteSelector';
import ScaleSelector from './ScaleSelector';
import render from '../tools/render';

export default class PerformanceMenu extends React.Component {
  render () {
    // jshint ignore: start
    return <div className="performance-menu">
      <div className="buttons-container">
        <button onClick={() => render(<InstrumentSelector />)}>Instrument</button>
        <button onClick={() => render(<EffectSelector />)}>Effects</button>
        <button onClick={() => render(<RootNoteSelector />)}>Root Note</button>
        <button onClick={() => render(<ScaleSelector />)}>Scale</button>
      </div>
    </div>;
    // jshint ignore: end
  }
}

import React from 'react';
import InstrumentAndEffectSelector from '../organisms/InstrumentAndEffectSelector';
import ScaleAndPitchSelector from '../organisms/ScaleAndPitchSelector';
import render from '../../tools/render';

export default class PerformanceMenu extends React.Component {
  render () {
    return <div className="performance-menu">
      <div className="buttons-container">
        <button onClick={() => render(<InstrumentAndEffectSelector />)}>Instrument</button>
        <button onClick={() => render(<ScaleAndPitchSelector />)}>Scale & Pitch</button>
      </div>
    </div>;
  }
}

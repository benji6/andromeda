import React from 'react';
import InstrumentSelectorContainer from './InstrumentSelectorContainer';
import EffectSelectorContainer from './EffectSelectorContainer';
import RootNoteSelectorContainer from './RootNoteSelectorContainer';
import ScaleSelectorContainer from './ScaleSelectorContainer';
import render from '../tools/render';

export default class PerformanceMenu extends React.Component {
  render () {
    return <div className="performance-menu">
      <div className="buttons-container">
        <button onClick={() => render(<InstrumentSelectorContainer />)}>Instrument</button>
        <button onClick={() => render(<EffectSelectorContainer />)}>Effects</button>
        <button onClick={() => render(<RootNoteSelectorContainer />)}>Root Note</button>
        <button onClick={() => render(<ScaleSelectorContainer />)}>Scale</button>
      </div>
    </div>;
  }
}

import React from 'react'; // eslint-disable-line
import InstrumentAndEffectSelector from '../organisms/InstrumentAndEffectSelector';
import ScaleAndPitchSelector from '../organisms/ScaleAndPitchSelector';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';

export default () => (
  <div className="performance-menu">
    <div className="buttons-container">
      <button onClick={() => render(
        <Provider store={store}>
          <InstrumentAndEffectSelector />
        </Provider>)}>Instrument</button>
      <button onClick={() => render(
        <Provider store={store}>
          <ScaleAndPitchSelector />
        </Provider>
      )}>Scale & Pitch</button>
    </div>
  </div>
);

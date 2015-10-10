import React from 'react'; // eslint-disable-line
import InstrumentAndEffectSelector from '../pages/InstrumentAndEffectSelector';
import ScaleAndPitchSelector from '../pages/ScaleAndPitchSelector';
import render from '../../tools/render';
import {Provider} from 'react-redux';
import store from '../../store';
import FullButton from '../atoms/FullButton';

export default () =>
  <div className="performance-menu">
    <div className="buttons-container">
      <FullButton onClick={() => render(
        <Provider store={store}>
          <InstrumentAndEffectSelector />
        </Provider>)} text="Instrument" />
      <FullButton onClick={() => render(
        <Provider store={store}>
          <ScaleAndPitchSelector />
        </Provider>
      )} text="Scale & Pitch" />
    </div>
  </div>;

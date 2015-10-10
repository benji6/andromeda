import {compose, identity, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect, Provider} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateArpeggiatorIsOn,
        updateSelectedEffect,
        updateSelectedInstrument,
        updateSelectedPattern} from '../../actions';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import ModalDialog from '../templates/ModalDialog';
import PerformanceView from '../pages/PerformanceView';
import render from '../../tools/render';
import store from '../../store';

const eventCheckedPath = path(['currentTarget', 'checked']);
const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({arpeggiator: {arpeggiatorIsOn, patterns, selectedPattern},
                                   dispatch,
                                   instrument: {instruments, selectedInstrument},
                                   effect: {effects, selectedEffect}}) =>
  <ModalDialog components={
    <div>
      <Selector defaultValue={selectedInstrument}
                handleChange={compose(dispatch, updateSelectedInstrument, eventValuePath)}
                label="Instrument"
                options={instruments} />
      <Selector defaultValue={selectedEffect}
                handleChange={compose(dispatch, updateSelectedEffect, eventValuePath)}
                label="Effect"
                options={effects} />
      <ArpeggiatorSelector arpeggiatorIsOn={arpeggiatorIsOn}
                           dispatch={dispatch}
                           patterns={patterns}
                           selectedPattern={selectedPattern}
                           handleArpeggiatorIsOnChange={compose(dispatch, updateArpeggiatorIsOn, eventCheckedPath)}
                           handlePatternSelect={compose(dispatch, updateSelectedPattern, eventValuePath)} />
    </div>
  } onClose={() => render(
    <Provider store={store}>
      <PerformanceView />
    </Provider>
  )}/>);

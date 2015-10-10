import {compose, identity, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';
import ModalDialog from '../templates/ModalDialog';
import {Provider} from 'react-redux';
import store from '../../store';
import render from '../../tools/render';
import PerformanceView from '../pages/PerformanceView';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({dispatch,
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
    </div>
  } onClose={() => render(
    <Provider store={store}>
      <PerformanceView />
    </Provider>
  )}/>);

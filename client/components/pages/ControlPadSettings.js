import {compose, identity, path} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';
import ModalDialog from '../templates/ModalDialog';

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
  } to="/control-pad" />);

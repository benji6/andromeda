import {compose, identity, path} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';
import FullButton from '../atoms/FullButton';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({dispatch,
                                   instrument: {instruments, selectedInstrument},
                                   effect: {effects, selectedEffect}}) =>
  <div className="flex-column text-center">
    <h2 className="text-center">Control Pad Settings</h2>
    <Selector defaultValue={selectedInstrument}
              handleChange={compose(dispatch, updateSelectedInstrument, eventValuePath)}
              label="Instrument"
              options={instruments} />
    <Selector defaultValue={selectedEffect}
              handleChange={compose(dispatch, updateSelectedEffect, eventValuePath)}
              label="Effect"
              options={effects} />
    <div>
      <span className="inline-label-text"></span><FullButton text="OK" to="/control-pad" />
    </div>
  </div>);

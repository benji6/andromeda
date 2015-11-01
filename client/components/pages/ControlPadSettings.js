import capitalize from 'capitalize';
import {compose, identity, map, path} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateControlPadInstrument} from '../../actions';
import FullButton from '../atoms/FullButton';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({controlPad,
                                   dispatch,
                                   instruments}) =>
  <div className="flex-column text-center">
    <h2 className="text-center">Control Pad Settings</h2>
    <Selector defaultValue={controlPad.instrument}
              handleChange={(compose(dispatch, updateControlPadInstrument, eventValuePath))}
              label="Instrument"
              options={map(instrument => ({text: capitalize.words(instrument),
                                           value: instrument}),
                           instruments)} />
    <div>
      <span className="inline-label-text"></span><FullButton text="OK" to="/control-pad" />
    </div>
  </div>);

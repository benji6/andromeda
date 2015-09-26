import React from 'react'; // eslint-disable-line
import {updateSelectedInstrument} from '../../actions';
import Selector from '../molecules/Selector';

export default ({dispatch, instrument}) =>
  <div className="pattern-options">
    <h2>Settings</h2>
    <Selector handleChange={({target: {value}}) => dispatch(updateSelectedInstrument(value))}
              label="Instrument"
              options={instrument.instruments}
              defaultValue={instrument.selectedInstrument} />
  </div>;

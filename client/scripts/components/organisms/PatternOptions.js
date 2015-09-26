import React from 'react'; // eslint-disable-line
import {updateActivePatternInstrument} from '../../actions';
import Selector from '../molecules/Selector';

export default ({dispatch, instrument, pattern}) =>
  <div className="pattern-options">
    <h2>Settings</h2>
    <Selector handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
              label="Instrument"
              options={instrument.instruments}
              defaultValue={pattern.instrument} />
  </div>;

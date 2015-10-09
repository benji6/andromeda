import React from 'react'; // eslint-disable-line
import {updateActivePatternInstrument} from '../../actions';
import Selector from '../molecules/Selector';
import Slider from '../atoms/Slider';

export default ({dispatch, instrument, pattern, pattern: {xLength}}) =>
  <div className="pattern-options">
    <h2>Settings</h2>
    <Selector handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
              label="Instrument"
              options={instrument.instruments}
              defaultValue={pattern.instrument} />
    Pattern Length<Slider output={xLength} />
  </div>;

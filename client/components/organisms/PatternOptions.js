import {compose} from 'ramda';
import React from 'react'; // eslint-disable-line
import {updateActivePatternInstrument,
        updateActivePatternXLength} from '../../actions';
import Selector from '../molecules/Selector';
import RangeSelector from '../molecules/RangeSelector';

export default ({dispatch, instrument, pattern, pattern: {xLength}}) =>
  <div className="pattern-options">
    <h2>Settings</h2>
    <Selector handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
              label="Instrument"
              options={instrument.instruments}
              defaultValue={pattern.instrument} />
    <RangeSelector output={xLength}
                   max="16"
                   min="1"
                   onChange={({target: {value}}) => compose(dispatch,
                                                            updateActivePatternXLength,
                                                            Number)(value)}
                   text="Pattern Length" />
  </div>;

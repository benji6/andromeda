import {compose, identity, path} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import {updateActivePatternInstrument,
        updateActivePatternOctave,
        updateActivePatternXLength} from '../../actions';
import RangeSelector from '../molecules/RangeSelector';
import FullButton from '../atoms/FullButton';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({activePatternIndex,
                                   dispatch,
                                   instrument: {instruments},
                                   patterns}) => {
  const activePattern = patterns[activePatternIndex];
  const {instrument, octave, xLength} = activePattern;
  return <div className="flex-column text-center">
    <h2 className="text-center">Pattern Editor Settings</h2>
    <Selector key="1"
              handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
              label="Instrument"
              options={instruments}
              defaultValue={instrument} />
    <RangeSelector key="2"
                   max="16"
                   min="1"
                   onChange={({target: {value}}) => compose(dispatch, updateActivePatternXLength, Number)(value)}
                   output={String(xLength)}
                   text="Length"
                   value={xLength} />
    <RangeSelector key="3"
                   max="2"
                   min="-3"
                   onChange={compose(dispatch, updateActivePatternOctave, Number, eventValuePath)}
                   output={octave}
                   text="Octave"
                   value={octave} />
    <div>
      <span className="inline-label-text"></span><FullButton text="OK" to="/pattern-editor" />
    </div>
  </div>;
});

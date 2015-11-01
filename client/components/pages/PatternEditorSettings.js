import {compose, identity, path} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import {mapIndexed} from '../../tools/indexedIterators';
import {updateActivePatternChannel,
        updateActivePatternOctave,
        updateActivePatternXLength} from '../../actions';
import Selector from '../molecules/Selector';
import RangeSelector from '../molecules/RangeSelector';
import FullButton from '../atoms/FullButton';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({activePatternIndex,
                                   channels,
                                   dispatch,
                                   patterns}) => {
  const activePattern = patterns[activePatternIndex];
  const {channel, octave, xLength} = activePattern;
  return <div className="flex-column text-center">
    <h2 className="text-center">Pattern Editor Settings</h2>
    <Selector defaultValue={channel}
              handleChange={(compose(dispatch,
                                     updateActivePatternChannel,
                                     Number,
                                     eventValuePath))}
              label="Channel"
              options={mapIndexed((_, i) => ({text: `Channel ${i}`,
                                              value: i}), channels)} />
    <RangeSelector key="2"
                   max="16"
                   min="1"
                   onChange={compose(dispatch,
                                     updateActivePatternXLength,
                                     Number,
                                     eventValuePath)}
                   output={String(xLength)}
                   text="Length"
                   value={xLength} />
    <RangeSelector key="3"
                   max="2"
                   min="-3"
                   onChange={compose(dispatch,
                                     updateActivePatternOctave,
                                     Number,
                                     eventValuePath)}
                   output={octave}
                   text="Octave"
                   value={octave} />
    <div>
      <span className="inline-label-text"></span>
      <FullButton text="OK" to="/pattern-editor" />
    </div>
  </div>;
});

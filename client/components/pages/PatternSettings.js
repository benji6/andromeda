import {compose, identity, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import ModalDialog from '../templates/ModalDialog';
import {updateActivePatternInstrument,
        updateActivePatternOctave,
        updateActivePatternXLength} from '../../actions';
import RangeSelector from '../molecules/RangeSelector';
import {Provider} from 'react-redux';
import store from '../../store';
import render from '../../tools/render';
import PatternEditor from '../pages/PatternEditor';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({activePatternIndex,
                                   dispatch,
                                   instrument: {instruments},
                                   patterns}) => {
  const activePattern = patterns[activePatternIndex];
  const {instrument, octave, xLength} = activePattern;
  return <ModalDialog components={[
    <Selector key="1"
              handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
              label="Instrument"
              options={instruments}
              defaultValue={instrument} />,
    <RangeSelector key="2"
                   max="16"
                   min="1"
                   onChange={({target: {value}}) => compose(dispatch, updateActivePatternXLength, Number)(value)}
                   output={String(xLength)}
                   text="Length"
                   value={xLength} />,
    <RangeSelector key="3"
                   max="2"
                   min="-3"
                   onChange={compose(dispatch, updateActivePatternOctave, Number, eventValuePath)}
                   output={octave}
                   text="Octave"
                   value={octave} />,
  ]} onClose={() => render(
   <Provider store={store}>
     <PatternEditor />
   </Provider>
  )} />;
});

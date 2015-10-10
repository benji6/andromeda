import {compose, identity} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import ModalDialog from '../templates/ModalDialog';
import {updateActivePatternInstrument,
        updateActivePatternXLength} from '../../actions';
import RangeSelector from '../molecules/RangeSelector';
import {Provider} from 'react-redux';
import store from '../../store';
import render from '../../tools/render';
import PatternEditor from '../pages/PatternEditor';

export default connect(identity)(({activePatternIndex,
                                   dispatch,
                                   instrument: {instruments},
                                   patterns}) => {
  const activePattern = patterns[activePatternIndex];
  const {instrument, xLength} = activePattern;
  return <ModalDialog components={
    <div>
      <Selector handleChange={({target: {value}}) => dispatch(updateActivePatternInstrument(value))}
                label="Instrument"
                options={instruments}
                defaultValue={instrument} />
      <RangeSelector max="16"
                     min="1"
                     onChange={({target: {value}}) => compose(dispatch, updateActivePatternXLength, Number)(value)}
                     output={String(xLength)}
                     text="Length"
                     value={xLength} />
    </div>
  } onClose={() => render(
   <Provider store={store}>
     <PatternEditor />
   </Provider>
  )} />;
});

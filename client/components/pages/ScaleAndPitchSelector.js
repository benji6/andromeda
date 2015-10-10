import {compose, identity, keys, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect, Provider} from 'react-redux';
import FullButton from '../atoms/FullButton';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import RangeSelector from '../molecules/RangeSelector';
import Selector from '../molecules/Selector';
import {updateArpeggiatorIsOn,
        updateSelectedPattern,
        updateSelectedRootNote,
        updateSelectedScale} from '../../actions';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import store from '../../store';
import render from '../../tools/render';
import PerformanceView from '../pages/PerformanceView';

const eventValuePath = path(['currentTarget', 'value']);
const eventCheckedPath = path(['currentTarget', 'checked']);

export default connect(identity)(({arpeggiator, dispatch, rootNote, scale}) => {
  const {scaleName, scales} = scale;
  const {arpeggiatorIsOn, patterns, selectedPattern} = arpeggiator;
  return (
    <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <RangeSelector
            rootNote={rootNote}
            onChange={compose(
              dispatch,
              updateSelectedRootNote,
              Number,
              eventValuePath
            )}
            max="24"
            min="-36"
            output={noteNameFromPitch(rootNote)}
            text="Root Note"
            value={rootNote} />
        <Selector defaultValue={scaleName}
                  handleChange={compose(dispatch,
                                        updateSelectedScale,
                                        eventValuePath)}
                  label="Scale"
                  options={keys(scales)} />
          <ArpeggiatorSelector
            arpeggiatorIsOn={arpeggiatorIsOn}
            dispatch={dispatch}
            patterns={patterns}
            selectedPattern={selectedPattern}
            handleArpeggiatorIsOnChange={compose(
              dispatch,
              updateArpeggiatorIsOn,
              eventCheckedPath
            )}
            handlePatternSelect={compose(
              dispatch,
              updateSelectedPattern,
              eventValuePath
            )}
          />
          <div className="text-right">
            <FullButton onClick={() => render(
              <Provider store={store}>
                <PerformanceView />
              </Provider>
            )} text="OK" />
          </div>
        </div>
      </div>
    </div>
  );
});

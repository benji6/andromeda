import {compose, identity, keys, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import RangeSelector from '../molecules/RangeSelector';
import Selector from '../molecules/Selector';
import ModalOKButton from '../atoms/ModalOKButton';
import {updateArpeggiatorIsOn,
        updateSelectedPattern,
        updateSelectedRootNote,
        updateSelectedScale} from '../../actions';

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
            handleRootNoteChange={compose(
              dispatch,
              updateSelectedRootNote,
              Number,
              eventValuePath
            )}
          />
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
          <ModalOKButton />
        </div>
      </div>
    </div>
  );
});

/* global R */
import React from 'react';
import {connect} from 'react-redux';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import RootNoteSelector from '../molecules/RootNoteSelector';
import ScaleSelector from '../molecules/ScaleSelector';
import ModalOKButton from '../atoms/ModalOKButton';
import {
  updateArpeggiatorIsOn,
  updateSelectedPattern,
  updateSelectedRootNote,
  updateSelectedScale,
} from '../../actions';

const {compose, path} = R;
const eventValuePath = path(['currentTarget', 'value']);
const eventCheckedPath = path(['currentTarget', 'checked']);

@connect(x => x)
export default class RootNoteContainer extends React.Component {
  render() {
    const {arpeggiator, dispatch, rootNote, scale} = this.props;
    const {scaleName, scales} = scale;
    const {arpeggiatorIsOn, patterns, selectedPattern} = arpeggiator;
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <RootNoteSelector
              rootNote={rootNote}
              handleRootNoteChange={compose(
                dispatch,
                updateSelectedRootNote,
                Number,
                eventValuePath
              )}
            />
            <ScaleSelector
              handleScaleChange={compose(
                dispatch,
                updateSelectedScale,
                eventValuePath
              )}
              scaleName={scaleName}
              scales={scales}
            />
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
  }
}

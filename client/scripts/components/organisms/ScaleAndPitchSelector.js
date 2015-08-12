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

} from '../../actions/creators';

class RootNoteContainer extends React.Component {
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
              handleRootNoteChange={({currentTarget: {value}}) => dispatch(updateSelectedRootNote(Number(value)))}
            />
            <ScaleSelector
              handleScaleChange={({currentTarget: {value}}) => dispatch(updateSelectedScale(value))}
              scaleName={scaleName}
              scales={scales}
            />
            <ArpeggiatorSelector
              arpeggiatorIsOn={arpeggiatorIsOn}
              dispatch={dispatch}
              patterns={patterns}
              selectedPattern={selectedPattern}
              handleArpeggiatorIsOnChange={
                ({currentTarget: {checked}}) => dispatch(updateArpeggiatorIsOn(checked))
              }
              handlePatternSelect={({currentTarget: {value}}) => dispatch(updateSelectedPattern(value))}
            />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(x => x)(RootNoteContainer);

import {compose, identity, keys, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import ModalDialog from '../templates/ModalDialog';
import RangeSelector from '../molecules/RangeSelector';
import Selector from '../molecules/Selector';
import {updateArpeggiatorIsOn,
        updateSelectedPattern,
        updateSelectedRootNote,
        updateSelectedScale} from '../../actions';
import noteNameFromPitch from '../../tools/noteNameFromPitch';

const eventValuePath = path(['currentTarget', 'value']);
const eventCheckedPath = path(['currentTarget', 'checked']);

export default connect(identity)(({arpeggiator: {arpeggiatorIsOn, patterns, selectedPattern},
                                   dispatch,
                                   rootNote, scale: {scaleName, scales}}) =>
  <ModalDialog components={[
    <RangeSelector
      rootNote={rootNote}
      onChange={compose(dispatch, updateSelectedRootNote, Number, eventValuePath)}
      max="24"
      min="-36"
      output={noteNameFromPitch(rootNote)}
      text="Root Note"
      value={rootNote} />,
    <Selector defaultValue={scaleName}
              handleChange={compose(dispatch, updateSelectedScale, eventValuePath)}
              label="Scale"
              options={keys(scales)} />,
    <ArpeggiatorSelector
      arpeggiatorIsOn={arpeggiatorIsOn}
      dispatch={dispatch}
      patterns={patterns}
      selectedPattern={selectedPattern}
      handleArpeggiatorIsOnChange={compose(dispatch, updateArpeggiatorIsOn, eventCheckedPath)}
      handlePatternSelect={compose(dispatch, updateSelectedPattern, eventValuePath)}
    />]} />
  );

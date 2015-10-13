import {compose, identity, keys, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {updateArpeggiatorIsOn,
        updateBpm,
        updateSelectedRootNote,
        updateSelectedScale,
        updateSelectedPattern} from '../../actions';
import Navigation from '../organisms/Navigation';
import RangeSelector from '../molecules/RangeSelector';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import Selector from '../molecules/Selector';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';

const minBpm = 32;
const eventValuePath = path(['currentTarget', 'value']);
const eventCheckedPath = path(['currentTarget', 'checked']);

export default connect(identity)(({arpeggiator: {arpeggiatorIsOn, patterns, selectedPattern},
                                   bpm,
                                   dispatch,
                                   rootNote,
                                   scale: {scaleName, scales}}) =>
  <div className="settings-view">
    <Navigation />
    <h1 className="text-center">Settings</h1>
    <div className="settings-container">
      <RangeSelector output={bpm}
                     max="512"
                     min={minBpm}
                     onChange={compose(dispatch, updateBpm, Number, path(['target', 'value']))}
                     text="BPM"
                     value={bpm} />
     <RangeSelector max="24"
                    min="-36"
                    onChange={compose(dispatch, updateSelectedRootNote, Number, eventValuePath)}
                    output={noteNameFromPitch(rootNote)}
                    text="Root Note"
                    value={rootNote} />
      <Selector defaultValue={scaleName}
                handleChange={compose(dispatch, updateSelectedScale, eventValuePath)}
                label="Scale"
                options={keys(scales)} />
      <ArpeggiatorSelector arpeggiatorIsOn={arpeggiatorIsOn}
                           dispatch={dispatch}
                           patterns={patterns}
                           selectedPattern={selectedPattern}
                           handleArpeggiatorIsOnChange={compose(dispatch, updateArpeggiatorIsOn, eventCheckedPath)}
                           handlePatternSelect={compose(dispatch, updateSelectedPattern, eventValuePath)} />
    </div>
  </div>);

import React from 'react'; // eslint-disable-line
import Navigation from '../organisms/Navigation';
import RangeSelector from '../molecules/RangeSelector';
import {connect} from 'react-redux';
import {updateBpm, updateSelectedRootNote} from '../../actions';
import {compose, identity, path} from 'ramda';
import noteNameFromPitch from '../../tools/noteNameFromPitch';

const minBpm = 32;
const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({bpm, dispatch, rootNote}) =>
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
    </div>
  </div>);

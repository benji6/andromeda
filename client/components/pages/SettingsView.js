import React from 'react'; // eslint-disable-line
import Navigation from '../organisms/Navigation';
import RangeSelector from '../molecules/RangeSelector';
import {connect} from 'react-redux';
import {updateBpm, updateSelectedRootNote, updateSelectedScale} from '../../actions';
import {compose, identity, keys, path} from 'ramda';
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import Selector from '../molecules/Selector';

const minBpm = 32;
const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({bpm, dispatch, rootNote, scale: {scaleName, scales}}) =>
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
    </div>
  </div>);

import React from 'react'; // eslint-disable-line
import Navigation from '../organisms/Navigation';
import {connect} from 'react-redux';
import {updateBpm} from '../../actions';
import {compose, identity, path} from 'ramda';

const minBpm = 20;
const enforceMinBpm = bpm => bpm < minBpm ? minBpm : bpm;

export default connect(identity)(({bpm, dispatch}) =>
  <div className="settings-view">
    <Navigation />
    <h1 className="center">Settings</h1>
    <div className="settings-container">
      <label>BPM:
      <input defaultValue={bpm}
             min={minBpm}
             onChange={compose(dispatch, updateBpm, enforceMinBpm, Number, path(['target', 'value']))}
             type="number"></input>
      </label>
    </div>
  </div>);

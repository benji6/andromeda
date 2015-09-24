import React from 'react'; // eslint-disable-line
import Navigation from '../organisms/Navigation';
import {connect} from 'react-redux';
import {updateBpm} from '../../actions';
const {compose, identity, path} = R;

export default connect(identity)(({bpm, dispatch}) =>
  <div className="settings-view">
    <Navigation />
    <h1 className="center">Settings</h1>
    <div className="settings-container">
      <label>BPM:
      <input defaultValue={bpm}
             min="1"
             onChange={compose(dispatch, updateBpm, Number, path(['target', 'value']))}
             type="number"></input>
      </label>
    </div>
  </div>);

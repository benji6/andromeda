import React from 'react'; // eslint-disable-line
import Navigation from '../organisms/Navigation';
import RangeSelector from '../molecules/RangeSelector';
import {connect} from 'react-redux';
import {updateBpm} from '../../actions';
import {compose, identity, path} from 'ramda';

const minBpm = 32;

export default connect(identity)(({bpm, dispatch}) =>
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
    </div>
  </div>);

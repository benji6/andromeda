/* global R */
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {updatePlaying} from '../../actions';

const {identity} = R;

export default connect(identity)(({dispatch, playing}) =>
  <div className={`play-button ${playing ? 'selected' : ''}`}
       onClick={() => dispatch(updatePlaying(!playing))}></div>);

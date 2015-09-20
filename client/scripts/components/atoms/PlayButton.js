/* global R */
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import {updatePlaying} from '../../actions';

const {identity} = R;

export default connect(identity)(({onPlay, onStop, dispatch, playing}) =>
  <div className={`play-button ${playing ? 'selected' : ''}`}
       onClick={() => {
         if (playing) {
           onStop();
         } else {
           onPlay();
         }
         dispatch(updatePlaying(!playing));
       }}></div>);

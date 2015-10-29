import React from 'react';
import {connect} from 'react-redux';
import {updatePlaying} from '../../actions';

export default connect(x => x)(({onPlay, onStop, dispatch, playing}) =>
  <div className={`play-button ${playing ? 'selected' : ''}`}
       onClick={() => {
         if (playing) {
           onStop();
         } else {
           onPlay();
         }
         dispatch(updatePlaying(!playing));
       }}></div>);

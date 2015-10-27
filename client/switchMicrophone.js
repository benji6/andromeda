import audioContext from './audioContext';
import {updateMicrophoneIsAvailable} from './actions';

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

let mediaStreamSource;

export default dispatch => microphoneIsOn => {
  if (!navigator.getUserMedia) {
    return dispatch(updateMicrophoneIsAvailable(false));
  }
  if (microphoneIsOn) {
    navigator.getUserMedia(
      {audio: true},
      stream => {
        dispatch(updateMicrophoneIsAvailable(true));
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        mediaStreamSource.connect(audioContext.destination);
      },
      () => dispatch(updateMicrophoneIsAvailable(false))
    );
  } else {
    mediaStreamSource.disconnect();
  }
};

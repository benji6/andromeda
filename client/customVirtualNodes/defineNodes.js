import {addEffect} from '../actions';
import {dispatch} from '../store';
import adsr from './tools/adsr';
import virtualAudioGraph from '../virtualAudioGraph';
import pingPongDelay from './effects/pingPongDelay';
import none from './effects/none';
import detuned from './oscillatorBanks/detuned';
import fm from './oscillatorBanks/fm';
import reverbAsync from './effects/reverb-async';
import sine from './oscillatorBanks/sine';
import supersaw from './oscillatorBanks/supersaw';

virtualAudioGraph
  .defineNode(adsr, 'adsr')
  .defineNode(detuned, 'detuned')
  .defineNode(fm, 'fm')
  .defineNode(none, 'none')
  .defineNode(pingPongDelay, 'pingPongDelay')
  .defineNode(sine, 'sine')
  .defineNode(supersaw, 'supersaw');

reverbAsync('audio/sb.wav').then(reverb => virtualAudioGraph.defineNode(reverb, 'reverb chapel'))
                           .then(() => dispatch(addEffect('reverb chapel')));
reverbAsync('audio/h.wav').then(reverb => virtualAudioGraph.defineNode(reverb, 'reverb mausoleum'))
                          .then(() => dispatch(addEffect('reverb mausoleum')));
reverbAsync('audio/st.wav').then(reverb => virtualAudioGraph.defineNode(reverb, 'reverb stairwell'))
                           .then(() => dispatch(addEffect('reverb stairwell')));

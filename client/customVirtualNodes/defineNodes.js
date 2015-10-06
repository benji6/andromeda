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

virtualAudioGraph.defineNodes({
  adsr, detuned, fm, none, pingPongDelay, sine, supersaw,
});

const loadReverb = (uri, name) => reverbAsync(uri)
  .then(reverb => virtualAudioGraph.defineNodes({[name]: reverb}))
  .then(() => dispatch(addEffect(name)));

loadReverb('audio/sb.wav', 'reverb chapel');
loadReverb('audio/h.wav', 'reverb mausoleum');
loadReverb('audio/st.wav', 'reverb stairwell');

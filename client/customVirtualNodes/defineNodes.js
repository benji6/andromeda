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

reverbAsync('audio/sb.wav').then(reverb => virtualAudioGraph.defineNodes({'reverb chapel': reverb}))
                           .then(() => dispatch(addEffect('reverb chapel')));
reverbAsync('audio/h.wav').then(reverb => virtualAudioGraph.defineNodes({'reverb mausoleum': reverb}))
                          .then(() => dispatch(addEffect('reverb mausoleum')));
reverbAsync('audio/st.wav').then(reverb => virtualAudioGraph.defineNodes({'reverb stairwell': reverb}))
                           .then(() => dispatch(addEffect('reverb stairwell')));

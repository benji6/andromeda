import virtualAudioGraph from '../virtualAudioGraph';
import pingPongDelay from './effects/pingPongDelay';
import none from './effects/none';
import detuned from './oscillatorBanks/detuned';
import sine from './oscillatorBanks/sine';
import supersaw from './oscillatorBanks/supersaw';

virtualAudioGraph.defineNode(none, 'none');
virtualAudioGraph.defineNode(pingPongDelay, 'pingPongDelay');
virtualAudioGraph.defineNode(detuned, 'detuned');
virtualAudioGraph.defineNode(sine, 'sine');
virtualAudioGraph.defineNode(supersaw, 'supersaw');

import virtualAudioGraph from '../virtualAudioGraph';
import pingPongDelay from './effects/pingPongDelay';
import none from './effects/none';
import detuned from './oscillatorBanks/detuned';
import sine from './oscillatorBanks/sine';
import supersaw from './oscillatorBanks/supersaw';

virtualAudioGraph
  .defineNode(none, 'none')
  .defineNode(pingPongDelay, 'pingPongDelay')
  .defineNode(detuned, 'detuned')
  .defineNode(sine, 'sine')
  .defineNode(supersaw, 'supersaw');

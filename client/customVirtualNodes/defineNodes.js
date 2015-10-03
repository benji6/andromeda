import virtualAudioGraph from '../virtualAudioGraph';
import pingPongDelay from './effects/pingPongDelay';
import none from './effects/none';
import detuned from './oscillatorBanks/detuned';
import fm from './oscillatorBanks/fm';
import sine from './oscillatorBanks/sine';
import supersaw from './oscillatorBanks/supersaw';

virtualAudioGraph
  .defineNode(detuned, 'detuned')
  .defineNode(fm, 'fm')
  .defineNode(none, 'none')
  .defineNode(pingPongDelay, 'pingPongDelay')
  .defineNode(sine, 'sine')
  .defineNode(supersaw, 'supersaw');

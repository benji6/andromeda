import {mathMod, range} from 'ramda';
import virtualAudioGraph from './virtualAudioGraph';

virtualAudioGraph.update([
  {
    id: 0,
    node: 'gain',
    output: 'output',
    params: {
      gain: 0.2,
    },
  },
  {
    id: 1,
    node: 'oscillator',
    output: 0,
    params: {
      startTime: 0.5,
      stopTime: 1,
    },
  },
  {
    id: 2,
    node: 'oscillator',
    output: 0,
    params: {
      frequency: 660,
      startTime: 1.5,
      stopTime: 2,
    },
  },
  {
    id: 3,
    node: 'oscillator',
    output: 0,
    params: {
      startTime: 2.25,
      stopTime: 2.5,
    },
  },
]);

export default {
  play: ()=>{},
  stop: () => virtualAudioGraph.schedule([]),
};

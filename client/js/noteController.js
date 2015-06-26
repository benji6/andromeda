import {propEq} from 'ramda';
import VirtualAudioGraph from 'virtual-audio-graph';
import pingPongDelay from './customVirtualNodes/pingPongDelay';
import oscillatorBank from './customVirtualNodes/oscillatorBank';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const virtualAudioGraph = new VirtualAudioGraph();

virtualAudioGraph.defineNode(pingPongDelay, 'pingPongDelay');
virtualAudioGraph.defineNode(oscillatorBank, 'oscillatorBank');

export const playNote = ({pitch, modulation}) => {
  modulation = modulation === undefined ? 0.5 : modulation;

  virtualAudioGraph.update([
    {
      output: 'output',
      id: 0,
      node: 'pingPongDelay',
    },
    {
      output: ['output', 0],
      id: 2,
      node: 'oscillatorBank',
      params: {
        frequency: calculateFrequency(pitch),
        gain: (1 - modulation) / 4,
      },
    },
  ]);
};

export const stopNote = (note) => virtualAudioGraph.update([
  {
    output: 'output',
    id: 0,
    node: 'pingPongDelay',
  },
]);

import {append, propEq, reject} from 'ramda';
import VirtualAudioGraph from 'virtual-audio-graph';
import pingPongDelay from './customVirtualNodes/pingPongDelay';
import oscillatorBank from './customVirtualNodes/oscillatorBank';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const virtualAudioGraph = new VirtualAudioGraph();

virtualAudioGraph.defineNode(pingPongDelay, 'pingPongDelay');
virtualAudioGraph.defineNode(oscillatorBank, 'oscillatorBank');

let currentVirtualAudioGraph = [
  {
    output: 'output',
    id: 0,
    node: 'pingPongDelay',
  },
];

export const playNote = ({id, pitch, modulation}) => {
  modulation = modulation === undefined ? 0.5 : modulation;

  currentVirtualAudioGraph = reject(propEq('id', id), currentVirtualAudioGraph);

  currentVirtualAudioGraph = append({
    output: ['output', 0],
    id,
    node: 'oscillatorBank',
    params: {
      frequency: calculateFrequency(pitch),
      gain: (1 - modulation) / 4,
    },
  }, currentVirtualAudioGraph);

  virtualAudioGraph.update(currentVirtualAudioGraph);
};

export const stopNote = ({id}) => {
  currentVirtualAudioGraph = reject(propEq('id', id), currentVirtualAudioGraph);
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

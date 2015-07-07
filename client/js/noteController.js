import {append, propEq, reject} from 'ramda';
import virtualAudioGraph from './virtualAudioGraph';
import pingPongDelay from './customVirtualNodes/pingPongDelay';
import detuned from './customVirtualNodes/oscillatorBanks/detuned';
import sine from './customVirtualNodes/oscillatorBanks/sine';
import supersaw from './customVirtualNodes/oscillatorBanks/supersaw';
import alt from './alt';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

virtualAudioGraph.defineNode(pingPongDelay, 'pingPongDelay');
virtualAudioGraph.defineNode(detuned, 'detuned');
virtualAudioGraph.defineNode(sine, 'sine');
virtualAudioGraph.defineNode(supersaw, 'supersaw');

let currentVirtualAudioGraph = [
  {
    output: 'output',
    id: 0,
    node: 'pingPongDelay',
  },
];

export const playNote = ({id, pitch, modulation}) => {
  const InstrumentStore = alt.getStore('InstrumentStore');

  modulation = modulation === undefined ? 0.5 : modulation;

  currentVirtualAudioGraph = reject(propEq('id', id), currentVirtualAudioGraph);

  currentVirtualAudioGraph = append({
    output: ['output', 0],
    id,
    node: InstrumentStore.getState().selectedInstrument,
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

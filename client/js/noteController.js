import {append, propEq, reject} from 'ramda';
import virtualAudioGraph from './virtualAudioGraph';
import pingPongDelay from './customVirtualNodes/effects/pingPongDelay';
import none from './customVirtualNodes/effects/none';
import detuned from './customVirtualNodes/oscillatorBanks/detuned';
import sine from './customVirtualNodes/oscillatorBanks/sine';
import supersaw from './customVirtualNodes/oscillatorBanks/supersaw';
import alt from './alt';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

virtualAudioGraph.defineNode(none, 'none');
virtualAudioGraph.defineNode(pingPongDelay, 'pingPongDelay');
virtualAudioGraph.defineNode(detuned, 'detuned');
virtualAudioGraph.defineNode(sine, 'sine');
virtualAudioGraph.defineNode(supersaw, 'supersaw');

let currentVirtualAudioGraph = [];

export const playNote = ({id, pitch, modulation}) => {
  const EffectStore = alt.getStore('EffectStore');
  const InstrumentStore = alt.getStore('InstrumentStore');

  currentVirtualAudioGraph[0] = {
    output: 'output',
    id: 0,
    node: EffectStore.getState().selectedEffect,
  };

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

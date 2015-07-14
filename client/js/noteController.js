import {append, propEq, reject} from 'ramda';
import alt from './alt';
import virtualAudioGraph from './virtualAudioGraph';
const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

let currentVirtualAudioGraph = [];

export const playNote = ({id, pitch, modulation}) => {
  const EffectStore = alt.getStore('EffectStore');
  const InstrumentStore = alt.getStore('InstrumentStore');
  const RootNoteStore = alt.getStore('RootNoteStore');

  const rootNote = RootNoteStore.getState().rootNote;

  currentVirtualAudioGraph[0] = {
    output: 'output',
    id: 0,
    node: EffectStore.getState().selectedEffect,
  };

  modulation = modulation === undefined ? 0.5 : modulation;

  currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);

  currentVirtualAudioGraph = append({
    output: ['output', 0],
    id,
    node: InstrumentStore.getState().selectedInstrument,
    params: {
      frequency: calculateFrequency(pitch + rootNote),
      gain: (1 - modulation) / 4,
    },
  }, currentVirtualAudioGraph);

  virtualAudioGraph.update(currentVirtualAudioGraph);
};

export const stopNote = ({id}) => {
  currentVirtualAudioGraph = reject(propEq(id, 'id'), currentVirtualAudioGraph);
  virtualAudioGraph.update(currentVirtualAudioGraph);
};

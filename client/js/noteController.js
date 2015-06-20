import {propEq, reject} from 'ramda';
import VirtualAudioGraph from 'virtual-audio-graph';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  destination: audioContext.destination,
});

const createVirtualAudioGraphParams = (pitch, modulation = 0) => [
  {
    connections: 0,
    id: 1,
    name: 'gain',
    params: {
      gain: 1 - modulation,
    }
  },
  {
    connections: 1,
    id: 2,
    name: 'oscillator',
    params: {
      frequency: calculateFrequency(pitch),
      type: 'sawtooth',
    },
  },
  {
    connections: 1,
    id: 3,
    name: 'oscillator',
    params: {
      detune: -5,
      frequency: calculateFrequency(pitch + 12),
      type: 'triangle',
    },
  },
  {
    connections: 1,
    id: 4,
    name: 'oscillator',
    params: {
      detune: 4,
      frequency: calculateFrequency(pitch),
      type: 'square',
    },
  },
];

export const playNote = (pitch, modulation) => virtualAudioGraph.update(createVirtualAudioGraphParams(pitch, modulation));

export const stopNote = () => virtualAudioGraph.update(reject(propEq('name', 'oscillator'), createVirtualAudioGraphParams()));

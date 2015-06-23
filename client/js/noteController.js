import {propEq, reject} from 'ramda';
import VirtualAudioGraph from 'virtual-audio-graph';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const virtualAudioGraph = new VirtualAudioGraph();

const createVirtualAudioGraphParams = (pitch, modulation = 0) => {
  let id = 0;
  const delayTime = 1 / 3;
  const oscillatorOutputs = 6;

  return [
    {
      output: 'output',
      id: id++,
      node: 'stereoPanner',
      params: {
        pan: -1,
      }
    },
    {
      output: 'output',
      id: id++,
      node: 'stereoPanner',
      params: {
        pan: 1,
      }
    },
    {
      output: [1, 5],
      id: id++,
      node: 'delay',
      params: {
        maxDelayTime: delayTime,
        delayTime,
      },
    },
    {
      output: 2,
      id: id++,
      node: 'gain',
      params: {
        gain: 1 / 3,
      }
    },
    {
      output: [0, 3],
      id: id++,
      node: 'delay',
      params: {
        maxDelayTime: delayTime,
        delayTime,
      },
    },
    {
      output: 4,
      id: id++,
      node: 'gain',
      params: {
        gain: 1 / 3,
      }
    },
    {
      output: ['output', 5],
      id: id++,
      node: 'gain',
      params: {
        gain: (1 - modulation) / 4,
      }
    },
    {
      output: oscillatorOutputs,
      id: id++,
      node: 'oscillator',
      params: {
        detune: -2,
        frequency: calculateFrequency(pitch),
        type: 'sawtooth',
      },
    },
    {
      output: oscillatorOutputs,
      id: id++,
      node: 'oscillator',
      params: {
        detune: -5,
        frequency: calculateFrequency(pitch - 12),
        type: 'triangle',
      },
    },
    {
      output: oscillatorOutputs,
      id: id++,
      node: 'oscillator',
      params: {
        detune: 4,
        frequency: calculateFrequency(pitch),
        type: 'square',
      },
    },
  ];
};

const currentlyPlayingPitches = new Set();

export const playNote = ({pitch, modulation}) => {
  if (currentlyPlayingPitches.has(pitch)) {
    return;
  }

  currentlyPlayingPitches.add(pitch);
  virtualAudioGraph.update(createVirtualAudioGraphParams(pitch, modulation));
};

export const stopNote = ({pitch}) => {
  currentlyPlayingPitches.delete(pitch);
  virtualAudioGraph.update(reject(propEq('node', 'oscillator'), createVirtualAudioGraphParams()));
};

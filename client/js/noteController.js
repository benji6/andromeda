import {propEq, reject} from 'ramda';
import VirtualAudioGraph from 'virtual-audio-graph';

const calculateFrequency = (pitch) => 440 * Math.pow(2, pitch / 12);

const virtualAudioGraph = new VirtualAudioGraph();

const createVirtualAudioGraphParams = (pitch, modulation = 0) => {
  let id = 1;
  const delayTime = 1 / 3;
  const oscillatorConnections = 7;

  return [
    {
      connections: 0,
      id: id++,
      name: 'stereoPanner',
      params: {
        pan: -1,
      }
    },
    {
      connections: 0,
      id: id++,
      name: 'stereoPanner',
      params: {
        pan: 1,
      }
    },
    {
      connections: [2, 6],
      id: id++,
      name: 'delay',
      params: {
        maxDelayTime: delayTime,
        delayTime,
      },
    },
    {
      connections: 3,
      id: id++,
      name: 'gain',
      params: {
        gain: 1 / 3,
      }
    },
    {
      connections: [1, 4],
      id: id++,
      name: 'delay',
      params: {
        maxDelayTime: delayTime,
        delayTime,
      },
    },
    {
      connections: 5,
      id: id++,
      name: 'gain',
      params: {
        gain: 1 / 3,
      }
    },
    {
      connections: [0, 6],
      id: id++,
      name: 'gain',
      params: {
        gain: (1 - modulation) * 2 / 3,
      }
    },
    {
      connections: oscillatorConnections,
      id: id++,
      name: 'oscillator',
      params: {
        detune: -2,
        frequency: calculateFrequency(pitch),
        type: 'sawtooth',
      },
    },
    {
      connections: oscillatorConnections,
      id: id++,
      name: 'oscillator',
      params: {
        detune: -5,
        frequency: calculateFrequency(pitch - 12),
        type: 'triangle',
      },
    },
    {
      connections: oscillatorConnections,
      id: id++,
      name: 'oscillator',
      params: {
        detune: 4,
        frequency: calculateFrequency(pitch),
        type: 'square',
      },
    },
  ];
};

export const playNote = (pitch, modulation) => virtualAudioGraph.update(createVirtualAudioGraphParams(pitch, modulation));

export const stopNote = () => virtualAudioGraph.update(reject(propEq('name', 'oscillator'), createVirtualAudioGraphParams()));

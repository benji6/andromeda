export default ({gain, frequency}) => [
  {
    output: ['output'],
    id: 0,
    node: 'gain',
    params: {
      gain,
    }
  },
  {
    output: 0,
    id: 1,
    node: 'oscillator',
    params: {
      detune: -2,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 2,
    node: 'oscillator',
    params: {
      detune: -5,
      frequency: frequency - 12,
      type: 'triangle',
    },
  },
  {
    output: 0,
    id: 3,
    node: 'oscillator',
    params: {
      detune: 4,
      frequency,
      type: 'square',
    },
  },
];

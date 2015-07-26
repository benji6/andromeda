export default ({gain, frequency}) => ({
  0: {
    output: ['output'],
    node: 'gain',
    params: {
      gain,
    },
  },
  1: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: -2,
      frequency,
      type: 'sawtooth',
    },
  },
  2: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: -5,
      frequency: frequency - 12,
      type: 'triangle',
    },
  },
  3: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: 4,
      frequency,
      type: 'square',
    },
  },
});

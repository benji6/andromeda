export default ({gain, frequency}) => ({
  0: {
    node: 'gain',
    output: ['output'],
    params: {
      gain: 0.2,
    },
  },
  1: {
    node: 'oscillator',
    output: 0,
    params: {
      frequency,
    },
  },
  2: {
    node: 'gain',
    output: {id: 1, destination: 'frequency'},
    params: {
      gain: 1024,
    },
  },
  3: {
    node: 'oscillator',
    output: 2,
    params: {
      frequency: frequency * 2 * (4 - gain) / 4,
    },
  },
});

export default ({gain, frequency, startTime, stopTime}) => ({
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
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  2: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: -5,
      frequency: frequency - 12,
      startTime,
      stopTime,
      type: 'triangle',
    },
  },
  3: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: 4,
      frequency,
      startTime,
      stopTime,
      type: 'square',
    },
  },
});

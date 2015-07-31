export default ({gain, frequency, detune=12, startTime, stopTime}) => ({
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
      detune: -3 * detune,
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
      detune: -2 * detune,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  3: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: -detune,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  4: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: 0,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  5: {
    output: 0,
    node: 'oscillator',
    params: {
      detune,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  6: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: 2 * detune,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
  7: {
    output: 0,
    node: 'oscillator',
    params: {
      detune: 3 * detune,
      frequency,
      startTime,
      stopTime,
      type: 'sawtooth',
    },
  },
});

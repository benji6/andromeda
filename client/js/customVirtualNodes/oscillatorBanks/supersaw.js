export default ({gain, frequency, detune=12}) => [
  {
    output: ['output'],
    id: 0,
    node: 'gain',
    params: {
      gain,
    },
  },
  {
    output: 0,
    id: 1,
    node: 'oscillator',
    params: {
      detune: -3 * detune,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 2,
    node: 'oscillator',
    params: {
      detune: -2 * detune,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 3,
    node: 'oscillator',
    params: {
      detune: -detune,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 4,
    node: 'oscillator',
    params: {
      detune: 0,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 5,
    node: 'oscillator',
    params: {
      detune,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 6,
    node: 'oscillator',
    params: {
      detune: 2 * detune,
      frequency,
      type: 'sawtooth',
    },
  },
  {
    output: 0,
    id: 7,
    node: 'oscillator',
    params: {
      detune: 3 * detune,
      frequency,
      type: 'sawtooth',
    },
  },
];

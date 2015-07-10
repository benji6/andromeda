export default ({gain, frequency}) => [
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
      frequency,
      type: 'sine',
    },
  },
];

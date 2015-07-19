export default ({gain, frequency, startTime, stopTime}) => [
  {
    output: ['output'],
    id: 0,
    node: 'gain',
    params: {
      gain,
      startTime,
      stopTime,
    },
  },
  {
    output: 0,
    id: 1,
    node: 'oscillator',
    params: {
      frequency,
      type: 'sine',
      startTime,
      stopTime,
    },
  },
];

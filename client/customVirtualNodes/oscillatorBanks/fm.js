export default ({gain, frequency, startTime, stopTime}) => ({
  0: ['gain', ['output'], {gain: 0.2}],
  1: ['oscillator', 0, {frequency,
                        startTime,
                        stopTime}],
  2: ['gain', {key: 1, destination: 'frequency'}, {gain: 1024}],
  3: ['oscillator', 2, {frequency: frequency * 2 * (4 - gain) / 4,
                        startTime,
                        stopTime}]
})

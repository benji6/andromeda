export default ({gain, frequency, startTime, stopTime}) => ({
  0: ['gain', ['output'], {gain}],
  1: ['oscillator', 0, {detune: -2,
                        frequency,
                        startTime,
                        stopTime,
                        type: 'sawtooth'}],
  2: ['oscillator', 0, {detune: -5,
                        frequency: frequency - 12,
                        startTime,
                        stopTime,
                        type: 'triangle'}],
  3: ['oscillator', 0, {detune: 4,
                        frequency,
                        startTime,
                        stopTime,
                        type: 'square'}]
})

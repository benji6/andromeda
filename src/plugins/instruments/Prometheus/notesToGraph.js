import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'

const osc = ({detune, frequency, gain, pan, pitch, startTime, stopTime, type}) => ({
  0: ['gain', 'output', {gain}],
  1: ['stereoPanner', 0, {pan}],
  2: ['oscillator', 1, {
    detune,
    frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
    startTime,
    stopTime,
    type,
  }],
})

export default ({filter, oscillators, masterGain, masterPan}, notes) =>
  notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = ['gain', 'filter', {gain}]
    oscillators.forEach((oscParams, i) => {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscParams, frequency, startTime, stopTime}]
    })
    return acc
  }, {
    masterGain: ['gain', 'output', {gain: masterGain}],
    masterPan: ['stereoPanner', 'masterGain', {pan: masterPan}],
    filter: ['biquadFilter', 'masterPan', {
      frequency: filter.frequency,
      gain: filter.gain,
      Q: filter.Q,
      type: filter.type,
    }],
  })

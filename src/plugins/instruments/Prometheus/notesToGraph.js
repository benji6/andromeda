import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'

const forEachIndexed = (f, xs) => {
  for (let i = 0; i < xs.length; i++) f(xs[i], i)
}

const lfoNode = ({frequency, gain, type}) => ({
  0: ['gain', 'output', {gain}],
  1: ['oscillator', 0, {frequency, type}],
})

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

export default ({filter, lfo, master, oscillators}, notes) =>
  notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = ['gain', 'filter', {gain}]
    forEachIndexed((oscParams, i) => {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscParams, frequency, startTime, stopTime}]
    }, oscillators)
    return acc
  }, {
    lfo: [lfoNode, {key: 'filter', destination: 'frequency'}, lfo],
    masterGain: ['gain', 'output', {gain: master.gain}],
    masterPan: ['stereoPanner', 'masterGain', {pan: master.pan}],
    filter: ['biquadFilter', 'masterPan', filter],
  })

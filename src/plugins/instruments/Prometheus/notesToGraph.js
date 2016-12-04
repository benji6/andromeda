import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'

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

    for (let i = 0; i < oscillators.length; i++) {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscillators[i], frequency, startTime, stopTime}]
    }

    return acc
  }, {
    filter: ['biquadFilter', 'masterPan', filter],
    lfo: [lfoNode, {destination: 'frequency', key: 'filter'}, lfo],
    masterGain: ['gain', 'output', {gain: master.gain}],
    masterPan: ['stereoPanner', 'masterGain', {pan: master.pan}],
  })

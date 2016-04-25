import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'
import audioContext from '../../../audioContext'

const buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate)
buffer.getChannelData(0).set(new Float32Array([1, 1]))

const adsrNode = ({a, d, s}) => {
  const {currentTime} = audioContext
  return {
    0: ['gain', 'output', {gain: [
      ['setValueAtTime', 0, currentTime],
      ['linearRampToValueAtTime', 1, a + currentTime],
      ['linearRampToValueAtTime', s, a + d + currentTime],
    ]}, 'input'],
    1: ['bufferSource', 0, {buffer, loop: true}],
  }
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

export default ({adsr, filter, lfo, master, oscillators}, notes) =>
  notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = ['gain', 'filter', {gain}]
    oscillators.forEach((oscParams, i) => {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscParams, frequency, startTime, stopTime}]
    })
    return acc
  }, {
    adsr: [adsrNode, 'masterPan', adsr],
    lfo: [lfoNode, {key: 'filter', destination: 'frequency'}, lfo],
    masterGain: ['gain', 'output', {gain: master.gain}],
    masterPan: ['stereoPanner', 'masterGain', {pan: master.pan}],
    filter: ['biquadFilter', 'adsr', filter],
  })

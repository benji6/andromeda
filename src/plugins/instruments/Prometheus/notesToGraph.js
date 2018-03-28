import {
  biquadFilter,
  createNode,
  gain as gainNode,
  oscillator,
  stereoPanner,
} from 'virtual-audio-graph'
import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'

const lfoNode = createNode(({frequency, gain, type}) => ({
  0: gainNode('output', {gain}),
  1: oscillator(0, {frequency, type}),
}))

const osc = createNode(({detune, frequency, gain, pan, pitch, startTime, stopTime, type}) => ({
  0: gainNode('output', {gain}),
  1: stereoPanner(0, {pan}),
  2: oscillator(1, {
    detune,
    frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
    startTime,
    stopTime,
    type,
  }),
}))

export default ({filter, lfo, master, oscillatorSingles, oscillatorSupers}, notes) =>
  notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = gainNode('filter', {gain})

    for (let i = 0; i < oscillatorSingles.length; i++) {
      const oscillatorSingle = oscillatorSingles[i]
      acc[`oscSingle-${oscillatorSingle.id}-${id}`] = osc(noteGainId, Object.assign({}, oscillatorSingle, {frequency, startTime, stopTime}))
    }

    for (let i = 0; i < oscillatorSupers.length; i++) {
      const oscillatorSuper = oscillatorSupers[i]
      const {numberOfOscillators, type} = oscillatorSuper
      for (let j = 0; j < numberOfOscillators; j++) {
        acc[`oscSuper-${oscillatorSuper.id}-${j}-${id}`] = osc(noteGainId, {
          detune: oscillatorSuper.detune + (j - Math.floor(numberOfOscillators / 2)) * oscillatorSuper.spread,
          frequency,
          gain: oscillatorSuper.gain,
          pan: oscillatorSuper.pan,
          pitch: oscillatorSuper.pitch,
          startTime,
          stopTime,
          type: type === 'random'
            ? ['sawtooth', 'sine', 'square', 'triangle'][Math.floor(Math.random() * 4)]
            : type,
        })
      }
    }

    return acc
  }, {
    filter: biquadFilter('masterPan', filter),
    lfo: lfoNode({destination: 'frequency', key: 'filter'}, lfo),
    masterGain: gainNode('output', {gain: master.gain}),
    masterPan: stereoPanner('masterGain', {pan: master.pan}),
  })

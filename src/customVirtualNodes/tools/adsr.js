import audioContext from '../../audioContext'
import virtualAudioGraph from '../../virtualAudioGraph'

const {currentTime} = virtualAudioGraph

const buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate)
buffer.getChannelData(0).set(new Float32Array([1, 1]))

export default ({a, d, s}) => ({
  0: ['gain', 'output', {gain: [['setValueAtTime', 0, currentTime],
                                ['linearRampToValueAtTime', 1, currentTime + a],
                                ['linearRampToValueAtTime', s, currentTime + a + d]]}],
  1: ['bufferSource', 0, {buffer, loop: true}]
})

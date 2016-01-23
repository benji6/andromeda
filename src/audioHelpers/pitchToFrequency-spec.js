import test from 'tape'
import pitchToFrequency from './pitchToFrequency'

test('pitchToFrequency', t => {
  t.equals(pitchToFrequency(-12), 220)
  t.equals(pitchToFrequency(-1), 415.3046975799451)
  t.equals(pitchToFrequency(0), 440)
  t.equals(pitchToFrequency(1), 466.1637615180899)
  t.equals(pitchToFrequency(2), 493.8833012561241)
  t.equals(pitchToFrequency(12), 880)
  t.end()
})

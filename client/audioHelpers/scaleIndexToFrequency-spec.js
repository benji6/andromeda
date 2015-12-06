import test from 'tape'
import scaleIndexToFrequency from './scaleIndexToFrequency'
import {initialState} from '../reducers/scale'

const majorScale = initialState.scales.major

test('scaleIndexToFrequency', t => {
  t.equals(scaleIndexToFrequency(majorScale, -36), 12.978271799373287)
  t.equals(scaleIndexToFrequency(majorScale, -9), 184.9972113558172)
  t.equals(scaleIndexToFrequency(majorScale, -8), 207.65234878997256)
  t.equals(scaleIndexToFrequency(majorScale, -7), 220)
  t.equals(scaleIndexToFrequency(majorScale, -6), 246.94165062806206)
  t.equals(scaleIndexToFrequency(majorScale, -5), 277.1826309768721)
  t.equals(scaleIndexToFrequency(majorScale, -4), 293.6647679174076)
  t.equals(scaleIndexToFrequency(majorScale, -3), 329.6275569128699)
  t.equals(scaleIndexToFrequency(majorScale, -2), 369.9944227116344)
  t.equals(scaleIndexToFrequency(majorScale, -1), 415.3046975799451)
  t.equals(scaleIndexToFrequency(majorScale, 0), 440)
  t.equals(scaleIndexToFrequency(majorScale, 1), 493.8833012561241)
  t.equals(scaleIndexToFrequency(majorScale, 2), 554.3652619537442)
  t.equals(scaleIndexToFrequency(majorScale, 3), 587.3295358348151)
  t.equals(scaleIndexToFrequency(majorScale, 4), 659.2551138257398)
  t.equals(scaleIndexToFrequency(majorScale, 5), 739.9888454232688)
  t.equals(scaleIndexToFrequency(majorScale, 6), 830.6093951598903)
  t.equals(scaleIndexToFrequency(majorScale, 7), 880)
  t.equals(scaleIndexToFrequency(majorScale, 8), 987.7666025122483)
  t.equals(scaleIndexToFrequency(majorScale, 36), 15804.265640195976)
  t.end()
})

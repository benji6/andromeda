import test from 'tape'
import pitchFromScaleIndex from './pitchFromScaleIndex'

const majorScale = [0, 2, 4, 5, 7, 9, 11]

test('pitchFromScaleIndex', t => {
  t.equals(pitchFromScaleIndex(majorScale, -36), -61)
  t.equals(pitchFromScaleIndex(majorScale, -9), -15)
  t.equals(pitchFromScaleIndex(majorScale, -8), -13)
  t.equals(pitchFromScaleIndex(majorScale, -7), -12)
  t.equals(pitchFromScaleIndex(majorScale, -6), -10)
  t.equals(pitchFromScaleIndex(majorScale, -5), -8)
  t.equals(pitchFromScaleIndex(majorScale, -4), -7)
  t.equals(pitchFromScaleIndex(majorScale, -3), -5)
  t.equals(pitchFromScaleIndex(majorScale, -2), -3)
  t.equals(pitchFromScaleIndex(majorScale, -1), -1)
  t.equals(pitchFromScaleIndex(majorScale, 0), 0)
  t.equals(pitchFromScaleIndex(majorScale, 1), 2)
  t.equals(pitchFromScaleIndex(majorScale, 2), 4)
  t.equals(pitchFromScaleIndex(majorScale, 3), 5)
  t.equals(pitchFromScaleIndex(majorScale, 4), 7)
  t.equals(pitchFromScaleIndex(majorScale, 5), 9)
  t.equals(pitchFromScaleIndex(majorScale, 6), 11)
  t.equals(pitchFromScaleIndex(majorScale, 7), 12)
  t.equals(pitchFromScaleIndex(majorScale, 8), 14)
  t.equals(pitchFromScaleIndex(majorScale, 36), 62)
  t.end()
})

import test from 'tape'
import noteNameFromPitch from './noteNameFromPitch'

test('noteNameFromPitch', t => {
  t.equals(noteNameFromPitch(-1), 'G#/Ab3')
  t.equals(noteNameFromPitch(0), 'A4')
  t.equals(noteNameFromPitch(1), 'A#/Bb4')
  t.equals(noteNameFromPitch(2), 'B4')
  t.equals(noteNameFromPitch(3), 'C4')
  t.equals(noteNameFromPitch(4), 'C#/Db4')
  t.equals(noteNameFromPitch(5), 'D4')
  t.equals(noteNameFromPitch(6), 'D#/Eb4')
  t.equals(noteNameFromPitch(7), 'E4')
  t.equals(noteNameFromPitch(8), 'F4')
  t.equals(noteNameFromPitch(9), 'F#/Gb4')
  t.equals(noteNameFromPitch(10), 'G4')
  t.equals(noteNameFromPitch(11), 'G#/Ab4')
  t.equals(noteNameFromPitch(12), 'A5')
  t.equals(noteNameFromPitch(13), 'A#/Bb5')
  t.end()
})

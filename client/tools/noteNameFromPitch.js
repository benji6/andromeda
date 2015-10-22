import circularIterable from 'circular-iterable';

const {floor} = Math;
const alphabeticalComponents = circularIterable('A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab');
const numberOfNotes = alphabeticalComponents.toArray().length;

export default pitch => {
  const octave = floor(pitch / numberOfNotes) + 4;
  return alphabeticalComponents(pitch % numberOfNotes) + octave;
};

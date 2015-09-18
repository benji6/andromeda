const {floor} = Math;
const alphabeticalComponents = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];
const numberOfNotes = alphabeticalComponents.length;

export default pitch => {
  const octave = floor(pitch / numberOfNotes) + 4;
  let positivePitch = pitch;
  while (positivePitch < 0) {
    positivePitch += 12;
  }
  return alphabeticalComponents[positivePitch % numberOfNotes] + octave;
};

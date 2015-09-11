import React from 'react'; // eslint-disable-line
const {abs, floor} = Math;

const computeNoteNameFromPitch = pitch => {
  const AlphabeticalComponents = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];
  const numberOfNotes = AlphabeticalComponents.length;
  const octave = floor(pitch / numberOfNotes) + 4;
  return AlphabeticalComponents[abs(pitch) % numberOfNotes] + octave;
};

export default ({handleRootNoteChange, rootNote}) => (
  <label>
    <div>
      <span></span>
      <output>{computeNoteNameFromPitch(rootNote)}</output>
    </div>
    <span>Root Note</span>
    <input max="24"
           min="-36"
           onChange={handleRootNoteChange}
           type="range"
           value={rootNote} />
  </label>
);

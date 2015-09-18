import React from 'react'; // eslint-disable-line
import noteNameFromPitch from '../../tools/noteNameFromPitch';

export default ({handleRootNoteChange, rootNote}) =>
  <label>
    <div>
      <span></span>
      <output>{noteNameFromPitch(rootNote)}</output>
    </div>
    <span>Root Note</span>
    <input max="24"
           min="-36"
           onChange={handleRootNoteChange}
           type="range"
           value={rootNote} />
  </label>;

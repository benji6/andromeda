import React from 'react'; // eslint-disable-line
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import Slider from '../atoms/Slider';

export default ({handleRootNoteChange, rootNote}) =>
  <label className="selector">
    <span>Root Note</span>
    <Slider max="24"
            min="-36"
            onChange={handleRootNoteChange}
            output={noteNameFromPitch(rootNote)}
            rootNote={rootNote}
            type="range"
            value={rootNote} />
  </label>;

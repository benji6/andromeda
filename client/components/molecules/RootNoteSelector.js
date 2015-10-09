import React from 'react'; // eslint-disable-line
import noteNameFromPitch from '../../tools/noteNameFromPitch';
import Slider from '../atoms/Slider';
import InputLabel from '../atoms/InputLabel';

export default ({handleRootNoteChange, rootNote}) =>
  <label className="selector">
    <InputLabel text="Root Note" />
    <Slider max="24"
            min="-36"
            onChange={handleRootNoteChange}
            output={noteNameFromPitch(rootNote)}
            rootNote={rootNote}
            type="range"
            value={rootNote} />
  </label>;

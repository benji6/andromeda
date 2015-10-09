import React from 'react'; // eslint-disable-line
import Slider from '../atoms/Slider';
import InputLabel from '../atoms/InputLabel';

export default ({handleRootNoteChange, max, min, output, rootNote, text}) =>
  <label className="selector">
    <InputLabel text={text} />
    <Slider max={max}
            min={min}
            onChange={handleRootNoteChange}
            output={output}
            rootNote={rootNote}
            type="range"
            value={rootNote} />
  </label>;

import React from 'react'; // eslint-disable-line

export default ({max, min, onChange, rootNote, type, value, output}) =>
  <div className="slider">
    <div>
      <output>{output}</output>
    </div>
    <input max={max}
           min={min}
           onChange={onChange}
           type="range"
           value={rootNote} />
  </div>;

import React from 'react';

export default ({max, min, onChange, value, output}) =>
  <div className="slider">
    <div>
      <output>{output}</output>
    </div>
    <input max={max}
           min={min}
           onChange={onChange}
           type="range"
           value={value} />
  </div>;

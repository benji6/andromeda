import React from 'react';
import Slider from '../atoms/Slider';
import InputLabel from '../atoms/InputLabel';

export default ({onChange, max, min, output, value, text}) =>
  <label className="selector">
    <InputLabel text={text} />
    <Slider max={max}
            min={min}
            onChange={onChange}
            output={output}
            type="range"
            value={value} />
  </label>;

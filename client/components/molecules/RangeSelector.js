import React from 'react';
import Slider from '../atoms/Slider';
import InputLabel from '../atoms/InputLabel';

export default ({text, ...props}) =>
  <label className="selector">
    <InputLabel text={text} />
    <Slider type="range"
            {...props} />
  </label>;

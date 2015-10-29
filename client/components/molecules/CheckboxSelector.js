import React from 'react';
import Checkbox from '../atoms/Checkbox';
import InputLabel from '../atoms/InputLabel';

export default ({checked, disabled, onChange, text}) =>
  <label className="selector">
    <InputLabel text={text} />
    <Checkbox checked={checked}
              disabled={disabled}
              onChange={onChange} />
  </label>;

import capitalize from 'capitalize';
import React from 'react';
import {map} from 'ramda';
import InputLabel from '../atoms/InputLabel';

export default ({defaultValue,
                 handleChange,
                 label,
                 options}) =>
  <label className="selector">
    <InputLabel text={capitalize(label)} />
    <select className="full-button" onChange={handleChange}
            defaultValue={defaultValue}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize.words(item)}
        </option>, options)}
    </select>
  </label>;

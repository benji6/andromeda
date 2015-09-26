import capitalize from 'capitalize';
import React from 'react'; // eslint-disable-line
import {map} from 'ramda';

export default ({defaultValue,
                 handleChange,
                 label,
                 options}) =>
  <label className="selector">
    <span>{capitalize(label)}</span>
    <select onChange={handleChange}
            defaultValue={defaultValue}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize.words(item)}
        </option>, options)}
    </select>
  </label>;

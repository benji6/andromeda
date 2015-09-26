import capitalize from 'capitalize';
import React from 'react'; // eslint-disable-line
import {map} from 'ramda';

export default ({handleChange,
                 label,
                 options,
                 defaultValue}) =>
  <label className="selector">
    <span>{capitalize(label)}</span>
    <select onChange={handleChange}
            defaultValue={defaultValue}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize(item)}
        </option>, options)}
    </select>
  </label>;

import capitalize from 'capitalize';
import React from 'react'; // eslint-disable-line
import {keys, map} from 'ramda';

export default ({handleScaleChange, scaleName, scales}) =>
  <label>
    <span>Scale</span>
    <select defaultValue={scaleName} onChange={handleScaleChange}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize.words(item)}
        </option>, keys(scales))}
    </select>
  </label>;

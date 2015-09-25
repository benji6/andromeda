import capitalize from 'capitalize';
import React from 'react'; //eslint-disable-line
import {map} from 'ramda';

export default ({effects,
                 handleSelectEffect,
                 selectedEffect}) =>
  <label>
    <span>Effect</span>
    <select defaultValue={selectedEffect}
            onChange={handleSelectEffect}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize(item)}
        </option>, effects)}
    </select>
  </label>;

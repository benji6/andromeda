import capitalize from 'capitalize';
import React from 'react';
import {map} from 'ramda';
import InputLabel from '../atoms/InputLabel';
import FullSelect from '../atoms/FullSelect';

export default ({defaultValue,
                 handleChange,
                 label,
                 options}) =>
  <label className="selector">
    <InputLabel text={capitalize(label)} />
    <FullSelect defaultValue={defaultValue}
                onChange={handleChange}
                options={map(value => ({text: capitalize.words(value),
                                        value}), options)} />
  </label>;

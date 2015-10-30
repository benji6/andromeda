import {mapIndexed} from '../../tools/indexedIterators';
import React from 'react';

export default ({defaultValue, disabled, onChange, options}) =>
  <select className="full-button full-select"
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange}>
    {mapIndexed((item, i) =>
      <option value={item} key={i}>
        {item}
      </option>, options)}
  </select>;

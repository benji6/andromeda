import {mapIndexed} from '../../tools/indexedIterators';
import React from 'react';

export default ({defaultValue, disabled, onChange, options}) =>
  <select className="full-button full-select"
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange}>
    {mapIndexed(({text, value}, i) =>
      <option value={value} key={i}>
        {text}
      </option>, options)}
  </select>;

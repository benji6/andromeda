/* global R */
import capitalize from 'capitalize';
import React from 'react';
const {keys, map} = R;

export default class ScaleSelector extends React.Component {
  render () {
    const {handleScaleChange, scaleName, scales} = this.props;
    return (
      <label>
        <span>Scale</span>
        <select defaultValue={scaleName} onChange={handleScaleChange}>
          {map(item =>
            <option value={item} key={item}>
              {capitalize.words(item)}
            </option>, keys(scales))}
        </select>
      </label>
    );
  }
}

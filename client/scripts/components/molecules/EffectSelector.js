/* global R */
import capitalize from 'capitalize';
import React from 'react';
const {map} = R;

export default class EffectSelector extends React.Component {
  render () {
    const {
      effects,
      handleSelectEffect,
      selectedEffect,
    } = this.props;
    return (
      <label>
        <span>Effect</span>
        <select
          defaultValue={selectedEffect}
          onChange={handleSelectEffect}
        >
          {map(item =>
            <option value={item} key={item}>
              {capitalize(item)}
            </option>, effects)}
        </select>
      </label>
    );
  }
}

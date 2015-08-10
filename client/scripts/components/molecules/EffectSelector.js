/* global R */
import capitalize from 'capitalize';
import connectToStores from 'alt/utils/connectToStores';
const {map} = R;
import React from 'react';

@connectToStores
export default class EffectSelector extends React.Component {
  static getStores() {
    return [EffectStore];
  }

  static getPropsFromStores() {
    return EffectStore.getState();
  }

  handleSelect (e) {
    EffectActions.updateSelectedEffect(e.currentTarget.value);
  }

  render () {
    return (
      <label>
        <span>Effect</span>
        <select defaultValue={this.props.selectedEffect} onChange={this.handleSelect}>
          {map(item =>
            <option value={item} key={item}>
              {capitalize(item)}
            </option>, this.props.effects)}
        </select>
      </label>
    );
  }
}

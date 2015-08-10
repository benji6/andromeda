/* global R */
import capitalize from 'capitalize';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';
import ScaleActions from '../actions/ScaleActions';
import ScaleStore from '../stores/ScaleStore';
const {keys, map} = R;

@connectToStores
export default class ScaleSelector extends React.Component {
  static getStores() {
    return [ScaleStore];
  }

  static getPropsFromStores() {
    return ScaleStore.getState();
  }

  handleSelect (e) {
    ScaleActions.updateScale(e.currentTarget.value);
  }

  render () {
    return (
      <label>
        <span>Scale</span>
        <select defaultValue={this.props.scaleName} onChange={this.handleSelect}>
          {map(item =>
            <option value={item} key={item}>
              {capitalize.words(item)}
            </option>, keys(this.props.scales))}
        </select>
      </label>
    );
  }
}

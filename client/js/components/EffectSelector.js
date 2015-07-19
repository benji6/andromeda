import capitalize from 'capitalize';
import {map} from 'ramda';
import React from 'react';
import EffectActions from '../actions/EffectActions';

export default class EffectSelector extends React.Component {
  handleSelect (e) {
    EffectActions.updateSelectedEffect(e.currentTarget.value);
  }

  render () {
    return (
      <label>
        <span>Effect</span>
        <select selected={this.props.selectedEffect} onChange={this.handleSelect}>
          {map(item =>
            <option value={item} key={item}>
              {capitalize(item)}
            </option>, this.props.effects)}
        </select>
      </label>
    );
  }
}

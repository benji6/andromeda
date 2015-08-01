import capitalize from 'capitalize';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';
import {map} from 'ramda';
import ArpeggiatorActions from '../actions/ArpeggiatorActions';
import ArpeggiatorStore from '../stores/ArpeggiatorStore';

@connectToStores
export default class EffectSelector extends React.Component {
  static getStores() {
    return [ArpeggiatorStore];
  }

  static getPropsFromStores() {
    return ArpeggiatorStore.getState();
  }

  handleChange (e) {
    ArpeggiatorActions.updateArpeggiatorIsOn(e.currentTarget.checked);
  }

  handleSelect (e) {
    ArpeggiatorActions.updateSelectedPattern(e.currentTarget.value);
  }

  render () {
    return (
      <div>
        <label><span>Arpeggiator</span>
          <input type="checkbox" defaultChecked={this.props.arpeggiatorIsOn} onChange={this.handleChange}></input>
        </label>
        <label>
          <span>Pattern</span>
          <select disabled={!this.props.arpeggiatorIsOn} defaultValue={this.props.selectedPattern} onChange={this.handleSelect}>
            {map(item =>
              <option value={item} key={item}>
                {capitalize(item)}
              </option>, this.props.patterns)}
          </select>
        </label>
      </div>
    );
  }
}

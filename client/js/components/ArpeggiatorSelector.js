import React from 'react';
import ArpeggiatorActions from '../actions/ArpeggiatorActions';

export default class EffectSelector extends React.Component {
  handleChange (e) {
    console.log(e.currentTarget.checked);
    ArpeggiatorActions.updateArpeggiatorIsOn(e.currentTarget.checked);
  }

  render () {
    return (
      <label><span>Arpeggiator</span>
        <input type="checkbox" defaultChecked={this.props.arpeggiatorIsOn} onChange={this.handleChange}></input>
      </label>
    );
  }
}

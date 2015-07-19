import capitalize from 'capitalize';
import {map} from 'ramda';
import React from 'react';
import InstrumentActions from '../actions/InstrumentActions';

export default class InstrumentSelector extends React.Component {
  handleSelect (e) {
    InstrumentActions.updateSelectedInstrument(e.currentTarget.value);
  }

  render () {
    return (
      <label>
        <span>Instrument</span>
        <select defaultValue={this.props.selectedInstrument} onChange={this.handleSelect}>
          {map(item =>
            <option value={item} key={item}>
              {capitalize(item)}
            </option>, this.props.instruments)}
        </select>
      </label>
    );
  }
}

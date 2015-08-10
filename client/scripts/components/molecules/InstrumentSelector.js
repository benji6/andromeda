/* global R */
import capitalize from 'capitalize';
import connectToStores from 'alt/utils/connectToStores';
const {map} = R;
import React from 'react';

@connectToStores
export default class InstrumentSelector extends React.Component {
  static getStores() {
    return [InstrumentStore];
  }

  static getPropsFromStores() {
    return InstrumentStore.getState();
  }

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

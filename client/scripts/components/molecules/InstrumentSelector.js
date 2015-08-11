/* global R */
import capitalize from 'capitalize';
import React from 'react';
const {map} = R;

export default class InstrumentSelector extends React.Component {
  render () {
    const {
      handleSelectInstrument,
      instruments,
      selectedInstrument,
    } = this.props;
    return (
      <label>
        <span>Instrument</span>
        <select
          onChange={handleSelectInstrument}
          defaultValue={selectedInstrument}
        >
          {map(item =>
            <option value={item} key={item}>
              {capitalize(item)}
            </option>, instruments)}
        </select>
      </label>
    );
  }
}

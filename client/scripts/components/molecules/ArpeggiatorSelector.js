/* global R */
import capitalize from 'capitalize';
import React from 'react';
const {map} = R;

export default class extends React.Component {
  render () {
    const {
      arpeggiatorIsOn,
      handleArpeggiatorIsOnChange,
      handlePatternSelect,
      patterns,
      selectedPattern,
    } = this.props;
    return (
      <div>
        <label><span>Arpeggiator</span>
          <input
            defaultChecked={arpeggiatorIsOn}
            onChange={handleArpeggiatorIsOnChange}
            type="checkbox"
          />
        </label>
        <label>
          <span>Pattern</span>
          <select
            disabled={!arpeggiatorIsOn}
            defaultValue={selectedPattern}
            onChange={handlePatternSelect}
          >
            {map(item =>
              <option value={item} key={item}>
                {capitalize(item)}
              </option>, patterns)}
          </select>
        </label>
      </div>
    );
  }
}

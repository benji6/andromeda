/* global R */
import capitalize from 'capitalize';
import React from 'react'; // eslint-disable-line
const {map} = R;

export default ({arpeggiatorIsOn,
                 handleArpeggiatorIsOnChange,
                 handlePatternSelect,
                 patterns,
                 selectedPattern}) =>
  <div>
    <label><span>Arpeggiator</span>
      <input defaultChecked={arpeggiatorIsOn}
             onChange={handleArpeggiatorIsOnChange}
             type="checkbox" />
    </label>
    <label>
      <span>Pattern</span>
      <select disabled={!arpeggiatorIsOn}
              defaultValue={selectedPattern}
              onChange={handlePatternSelect}>
        {map(item =>
          <option value={item} key={item}>
            {capitalize(item)}
          </option>, patterns)}
      </select>
    </label>
  </div>;

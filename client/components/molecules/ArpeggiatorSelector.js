import capitalize from 'capitalize';
import React from 'react';
import {map} from 'ramda';
import InputLabel from '../atoms/InputLabel';
import Checkbox from '../atoms/Checkbox';

export default ({arpeggiatorIsOn,
                 handleArpeggiatorIsOnChange,
                 handlePatternSelect,
                 patterns,
                 selectedPattern}) =>
  <div className="flex-column">
    <label>
      <InputLabel text="Arpeggiator" />
      <Checkbox checked={arpeggiatorIsOn}
                onChange={handleArpeggiatorIsOnChange} />
    </label>
    <label>
      <InputLabel text="Pattern" />
      <select className="full-button"
              disabled={!arpeggiatorIsOn}
              defaultValue={selectedPattern}
              onChange={handlePatternSelect}>
        {map(item =>
          <option value={item} key={item}>
            {capitalize(item)}
          </option>, patterns)}
      </select>
    </label>
  </div>;

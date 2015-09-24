import capitalize from 'capitalize';
import React from 'react'; // eslint-disable-line
const {map} = R;

export default ({handleSelectInstrument,
                 instruments,
                 selectedInstrument}) =>
  <label>
    <span>Instrument</span>
    <select onChange={handleSelectInstrument}
            defaultValue={selectedInstrument}>
      {map(item =>
        <option value={item} key={item}>
          {capitalize(item)}
        </option>, instruments)}
    </select>
  </label>;

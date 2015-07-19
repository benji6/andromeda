import capitalize from 'capitalize';
import {map} from 'ramda';
import React from 'react';
import InstrumentActions from '../actions/InstrumentActions';
import ModalOKButton from './atoms/ModalOKButton';
import PerformanceView from './PerformanceView';
import render from '../tools/render';

export default class InstrumentSelector extends React.Component {
  handleSelect (e) {
    InstrumentActions.updateSelectedInstrument(e.currentTarget.value);
    setTimeout(() => render(<PerformanceView />), 0);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Instrument</h1>
          <div>
            <select value={this.props.selectedInstrument} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize(item)}
                </option>, this.props.instruments)}
            </select>
          </div>
          <ModalOKButton />
        </div>
      </div>
    </div>;
  }
}

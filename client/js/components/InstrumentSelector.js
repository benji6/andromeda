import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import InstrumentActions from '../actions/InstrumentActions';
import {map} from 'ramda';
import capitalize from 'capitalize';

export default class InstrumentSelector extends React.Component {
  handleClick () {
    render(<PerformanceView />);
  }

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
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

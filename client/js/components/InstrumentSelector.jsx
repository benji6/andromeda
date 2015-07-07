import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import InstrumentStore from '../stores/InstrumentStore';
import InstrumentActions from '../actions/InstrumentActions';
import {map} from 'ramda';
import capitalize from 'capitalize';

let boundOnChange = null;

export default class InstrumentSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = InstrumentStore.getState();
  }

  componentDidMount () {
    boundOnChange = this.onChange.bind(this);
    InstrumentStore.listen(boundOnChange);
  }

  componentWillUnmount () {
    InstrumentStore.unlisten(boundOnChange);
  }

  handleClick () {
    // jshint ignore: start
    render(<PerformanceView />);
    // jshint ignore: end
  }

  handleSelect (e) {
    InstrumentActions.updateSelectedInstrument(e.target.value);
  }

  onChange (state) {
    this.setState(state);
  }

  render () {
    // jshint ignore: start
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Instrument</h1>
          <div>
            <select value={this.state.selectedInstrument} onChange={this.handleSelect.bind(this)}>
              {map(instrument =>
                <option value={instrument} key={instrument}>
                  {capitalize(instrument)}
                </option>, this.state.instruments)}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
    // jshint ignore: end
  }
}

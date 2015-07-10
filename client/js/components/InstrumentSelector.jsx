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
    render(<PerformanceView />);
  }

  handleSelect (e) {
    InstrumentActions.updateSelectedInstrument(e.currentTarget.value);
  }

  onChange (state) {
    this.setState(state);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Instrument</h1>
          <div>
            <select value={this.state.selectedInstrument} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize(item)}
                </option>, this.state.instruments)}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';

export default class InstrumentSelector extends React.Component {
  handleClick () {
    render(<PerformanceView />);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <p>please select instrument</p>
        <div>
          <select>
            <option>Sines</option>
            <option>Squares</option>
            <option>Supersaw</option>
          </select>
        </div>
        <button onClick={this.handleClick}>OK</button>
      </div>
    </div>;
  }
}

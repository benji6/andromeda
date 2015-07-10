import capitalize from 'capitalize';
import {keys, map} from 'ramda';
import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import ScaleActions from '../actions/ScaleActions';

export default class ScaleSelector extends React.Component {
  handleClick () {
    render(<PerformanceView />);
  }

  handleSelect (e) {
    ScaleActions.updateScale(e.currentTarget.value);
    setTimeout(() => render(<PerformanceView />), 0);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Scale</h1>
          <div>
            <select value={this.props.scaleName} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize.words(item)}
                </option>, keys(this.props.scales))}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

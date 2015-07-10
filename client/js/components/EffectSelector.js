import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import EffectActions from '../actions/EffectActions';
import {map} from 'ramda';
import capitalize from 'capitalize';

export default class EffectSelector extends React.Component {
  handleClick () {
    render(<PerformanceView />);
  }

  handleSelect (e) {
    EffectActions.updateSelectedEffect(e.currentTarget.value);
    setTimeout(() => render(<PerformanceView />), 0);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Effect</h1>
          <div>
            <select value={this.props.selectedEffect} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize(item)}
                </option>, this.props.effects)}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

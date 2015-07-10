import capitalize from 'capitalize';
import {keys, map} from 'ramda';
import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import ScaleStore from '../stores/ScaleStore';
import ScaleActions from '../actions/ScaleActions';

let boundOnChange = null;

export default class ScaleSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = ScaleStore.getState();
  }

  componentDidMount () {
    boundOnChange = this.onChange.bind(this);
    ScaleStore.listen(boundOnChange);
  }

  componentWillUnmount () {
    ScaleStore.unlisten(boundOnChange);
  }

  handleClick () {
    render(<PerformanceView />);
  }

  handleSelect (e) {
    ScaleActions.updateScale(e.currentTarget.value);
  }

  onChange (state) {
    this.setState(state);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Scale</h1>
          <div>
            <select value={this.state.scaleName} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize.words(item)}
                </option>, keys(this.state.scales))}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

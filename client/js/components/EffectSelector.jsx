import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import EffectStore from '../stores/EffectStore';
import EffectActions from '../actions/EffectActions';
import {map} from 'ramda';
import capitalize from 'capitalize';

let boundOnChange = null;

export default class EffectSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = EffectStore.getState();
  }

  componentDidMount () {
    boundOnChange = this.onChange.bind(this);
    EffectStore.listen(boundOnChange);
  }

  componentWillUnmount () {
    EffectStore.unlisten(boundOnChange);
  }

  handleClick () {
    render(<PerformanceView />);
  }

  handleSelect (e) {
    EffectActions.updateSelectedEffect(e.currentTarget.value);
  }

  onChange (state) {
    this.setState(state);
  }

  render () {
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Effect</h1>
          <div>
            <select value={this.state.selectedEffect} onChange={this.handleSelect}>
              {map(item =>
                <option value={item} key={item}>
                  {capitalize(item)}
                </option>, this.state.effects)}
            </select>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
  }
}

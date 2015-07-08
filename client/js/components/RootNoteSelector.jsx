import React from 'react';
import PerformanceView from './PerformanceView';
import render from '../tools/render';
import RootNoteStore from '../stores/RootNoteStore';
import RootNoteActions from '../actions/RootNoteActions';

let boundOnChange = null;

export default class RootNoteSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = RootNoteStore.getState();
  }

  componentDidMount () {
    boundOnChange = this.onChange.bind(this);
    RootNoteStore.listen(boundOnChange);
  }

  componentWillUnmount () {
    RootNoteStore.unlisten(boundOnChange);
  }

  handleClick () {
    // jshint ignore: start
    render(<PerformanceView />);
    // jshint ignore: end
  }

  handleChange (e) {
    RootNoteActions.updateRootNote(Number(e.currentTarget.value));
  }

  onChange (state) {
    this.setState(state);
  }

  render () {
    // jshint ignore: start
    return <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <h1>Root Note</h1>
            <output>{this.state.rootNote}</output>
          <div>
            <input max="24" min="-36" type="range" value={this.state.rootNote} onChange={this.handleChange}></input>
          </div>
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </div>;
    // jshint ignore: end
  }
}

import React from 'react';
import RootNoteActions from '../actions/RootNoteActions';

const {abs, floor} = Math;

const computeNoteNameFromPitch = (pitch) => {
  const AlphabeticalComponents = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];
  const numberOfNotes = AlphabeticalComponents.length;
  const octave = floor(pitch / numberOfNotes) + 4;
  return AlphabeticalComponents[abs(pitch) % numberOfNotes] + octave;
};

export default class RootNoteSelector extends React.Component {
  handleChange (e) {
    RootNoteActions.updateRootNote(Number(e.currentTarget.value));
  }

  render () {
    return (
      <label>
        <div>
          <span></span>
          <output>{computeNoteNameFromPitch(this.props.rootNote)}</output>
        </div>
        <span>Root Note</span>
        <input max="24" min="-36" type="range" value={this.props.rootNote} onChange={this.handleChange}></input>
      </label>
    );
  }
}

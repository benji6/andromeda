import AltContainer from 'alt/AltContainer';
import React from 'react';
import RootNoteStore from '../stores/RootNoteStore';
import RootNoteSelector from './RootNoteSelector';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <AltContainer store={RootNoteStore}>
        <RootNoteSelector />
      </AltContainer>
    );
  }
}

import AltContainer from 'alt/AltContainer';
import React from 'react';
import ScaleStore from '../stores/ScaleStore';
import ScaleSelector from './ScaleSelector';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <AltContainer store={ScaleStore}>
        <ScaleSelector />
      </AltContainer>
    );
  }
}

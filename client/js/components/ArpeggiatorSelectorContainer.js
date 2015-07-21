import AltContainer from 'alt/AltContainer';
import React from 'react';
import ArpeggiatorStore from '../stores/ArpeggiatorStore';
import ArpeggiatorSelector from './ArpeggiatorSelector';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <AltContainer store={ArpeggiatorStore}>
        <ArpeggiatorSelector />
      </AltContainer>
    );
  }
}

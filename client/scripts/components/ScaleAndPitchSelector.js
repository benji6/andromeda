import React from 'react';
import ArpeggiatorSelector from './ArpeggiatorSelector';
import RootNoteSelector from './RootNoteSelector';
import ScaleSelector from './ScaleSelector';
import ModalOKButton from './atoms/ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <RootNoteSelector />
            <ScaleSelector />
            <ArpeggiatorSelector />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

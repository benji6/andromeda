import React from 'react';
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector';
import RootNoteSelector from '../molecules/RootNoteSelector';
import ScaleSelector from '../molecules/ScaleSelector';
import ModalOKButton from '../atoms/ModalOKButton';

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

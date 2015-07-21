import React from 'react';
import ArpeggiatorSelectorContainer from './ArpeggiatorSelectorContainer';
import RootNoteSelectorContainer from './RootNoteSelectorContainer';
import ScaleSelectorContainer from './ScaleSelectorContainer';
import ModalOKButton from './atoms/ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <RootNoteSelectorContainer />
            <ScaleSelectorContainer />
            <ArpeggiatorSelectorContainer />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

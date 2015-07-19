import React from 'react';
import ScaleSelectorContainer from './ScaleSelectorContainer';
import RootNoteSelectorContainer from './RootNoteSelectorContainer';
import ModalOKButton from './atoms/ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <RootNoteSelectorContainer />
            <ScaleSelectorContainer />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

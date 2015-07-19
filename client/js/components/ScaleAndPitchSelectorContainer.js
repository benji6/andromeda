import AltContainer from 'alt/AltContainer';
import React from 'react';
import ScaleStore from '../stores/ScaleStore';
import ScaleSelector from './ScaleSelector';
import RootNoteStore from '../stores/RootNoteStore';
import RootNoteSelector from './RootNoteSelector';
import ModalOKButton from './ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <AltContainer store={RootNoteStore}>
              <RootNoteSelector />
            </AltContainer>
            <AltContainer store={ScaleStore}>
              <ScaleSelector />
            </AltContainer>
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

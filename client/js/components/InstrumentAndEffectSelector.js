import AltContainer from 'alt/AltContainer';
import React from 'react';
import EffectSelector from './EffectSelector';
import InstrumentSelector from './InstrumentSelector';
import ModalOKButton from './atoms/ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <InstrumentSelector />
            <EffectSelector />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

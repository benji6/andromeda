import React from 'react';
import EffectSelector from '../molecules/EffectSelector';
import InstrumentSelector from '../molecules/InstrumentSelector';
import ModalOKButton from '../atoms/ModalOKButton';

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

import AltContainer from 'alt/AltContainer';
import React from 'react';
import EffectSelectorContainer from './EffectSelectorContainer';
import InstrumentSelectorContainer from './InstrumentSelectorContainer';
import ModalOKButton from './atoms/ModalOKButton';

export default class RootNoteContainer extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <InstrumentSelectorContainer />
            <EffectSelectorContainer />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

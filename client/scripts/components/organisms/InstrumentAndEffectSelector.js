import React from 'react';
import {connect} from 'react-redux';
import EffectSelector from '../molecules/EffectSelector';
import InstrumentSelector from '../molecules/InstrumentSelector';
import ModalOKButton from '../atoms/ModalOKButton';

class RootNoteContainer extends React.Component {
  render() {
    const {dispatch, instrument, effect} = this.props;
    const {instruments, selectedInstrument} = instrument;
    const {effects, selectedEffect} = effect;
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <InstrumentSelector
              handleSelectInstrument={({currentTarget: {value}}) => dispatch({
                type: 'UPDATE_SELECTED_INSTRUMENT',
                value,
              })}
              instruments={instruments}
              selectedInstrument={selectedInstrument}
            />
            <EffectSelector
              handleSelectEffect={({currentTarget: {value}}) => dispatch({
                type: 'UPDATE_SELECTED_EFFECT',
                value,
              })}
              effects={effects}
              selectedEffect={selectedEffect}
            />
            <ModalOKButton />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(x => x)(RootNoteContainer);

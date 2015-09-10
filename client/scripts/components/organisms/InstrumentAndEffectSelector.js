/* global R */
import React from 'react';
import {connect} from 'react-redux';
import EffectSelector from '../molecules/EffectSelector';
import InstrumentSelector from '../molecules/InstrumentSelector';
import ModalOKButton from '../atoms/ModalOKButton';
import {
  updateSelectedEffect,
  updateSelectedInstrument,
} from '../../actions';

const {compose, path} = R;
const eventValuePath = path(['currentTarget', 'value']);

@connect(x => x)
export default class extends React.Component {
  render() {
    const {dispatch, instrument, effect} = this.props;
    const {instruments, selectedInstrument} = instrument;
    const {effects, selectedEffect} = effect;
    return (
      <div className="modal-container">
        <div className="modal-window">
          <div className="modal-contents">
            <InstrumentSelector
              handleSelectInstrument={compose(
                dispatch,
                updateSelectedInstrument,
                eventValuePath
              )}
              instruments={instruments}
              selectedInstrument={selectedInstrument}
            />
            <EffectSelector
              handleSelectEffect={compose(
                dispatch,
                updateSelectedEffect,
                eventValuePath
              )}
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

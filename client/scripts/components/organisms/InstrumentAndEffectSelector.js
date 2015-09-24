import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import EffectSelector from '../molecules/EffectSelector';
import InstrumentSelector from '../molecules/InstrumentSelector';
import ModalOKButton from '../atoms/ModalOKButton';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';

const {compose, identity, path} = R;
const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({dispatch, instrument, effect}) => {
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
});

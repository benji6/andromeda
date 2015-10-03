import {compose, identity, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import Selector from '../molecules/Selector';
import ModalOKButton from '../atoms/ModalOKButton';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';

const eventValuePath = path(['currentTarget', 'value']);

export default connect(identity)(({dispatch, instrument, effect}) => {
  const {instruments, selectedInstrument} = instrument;
  const {effects, selectedEffect} = effect;
  return (
    <div className="modal-container">
      <div className="modal-window">
        <div className="modal-contents">
          <Selector defaultValue={selectedInstrument}
                    handleChange={compose(dispatch,
                                          updateSelectedInstrument,
                                          eventValuePath)}
                    label="Instrument"
                    options={instruments} />
          <Selector defaultValue={selectedEffect}
                    handleChange={compose(dispatch,
                                          updateSelectedEffect,
                                          eventValuePath)}
                    label="Effect"
                    options={effects} />
          <ModalOKButton />
        </div>
      </div>
    </div>
  );
});

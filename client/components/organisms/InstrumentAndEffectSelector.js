import {compose, identity, path} from 'ramda';
import React from 'react'; // eslint-disable-line
import {connect, Provider} from 'react-redux';
import Selector from '../molecules/Selector';
import FullButton from '../atoms/FullButton';
import {updateSelectedEffect,
        updateSelectedInstrument} from '../../actions';
import store from '../../store';
import render from '../../tools/render';
import PerformanceView from '../pages/PerformanceView';

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
          <div className="text-right">
            <FullButton onClick={() => render(
              <Provider store={store}>
                <PerformanceView />
              </Provider>
            )} text="OK" />
          </div>
        </div>
      </div>
    </div>
  );
});

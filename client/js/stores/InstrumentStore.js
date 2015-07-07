import alt from '../alt';
import InstrumentActions from '../actions/InstrumentActions';

class InstrumentStore {
  constructor () {
    this.instruments = [
      'detuned',
      'sine',
      'supersaw',
    ];

    this.selectedInstrument = 'sine';

    this.bindListeners({
      handleUpdateSelectedInstrument: InstrumentActions.UPDATE_SELECTED_INSTRUMENT
    });
  }

  handleUpdateSelectedInstrument (item) {
    this.selectedInstrument = item;
  }
}

export default alt.createStore(InstrumentStore, 'InstrumentStore');

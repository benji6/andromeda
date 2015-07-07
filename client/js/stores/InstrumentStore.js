import alt from '../alt';
import InstrumentActions from '../components/InstrumentSelector/InstrumentActions';

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

  handleUpdateSelectedInstrument (instrument) {
    this.selectedInstrument = instrument;
  }
}

export default alt.createStore(InstrumentStore, 'InstrumentStore');

import alt from '../alt';
import InstrumentActions from '../actions/InstrumentActions';

export default alt.createStore(class InstrumentStore {
  constructor () {
    this.instruments = [
      'detuned',
      'fm',
      'sine',
      'supersaw',
    ];

    this.selectedInstrument = 'sine';

    this.bindListeners({
      handleUpdateSelectedInstrument: InstrumentActions.UPDATE_SELECTED_INSTRUMENT,
    });
  }

  handleUpdateSelectedInstrument (item) {
    this.selectedInstrument = item;
  }
}, 'InstrumentStore');

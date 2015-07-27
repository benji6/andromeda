import alt from '../alt';
import InstrumentActions from '../actions/InstrumentActions';

export default alt.createStore(class InstrumentStore {
  constructor () {
    this.bindListeners({
      handleUpdateSelectedInstrument: InstrumentActions.updateSelectedInstrument,
    });

    this.state = {
      instruments: [
        'detuned',
        'fm',
        'sine',
        'supersaw',
      ],
      selectedInstrument: 'sine',
    };
  }

  handleUpdateSelectedInstrument (item) {
    this.state.selectedInstrument = item;
  }
}, 'InstrumentStore');

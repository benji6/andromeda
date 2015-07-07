import alt from '../../alt';

class InstrumentActions {
  updateSelectedInstrument (instrument) {
    this.dispatch(instrument);
  }
}

export default alt.createActions(InstrumentActions);

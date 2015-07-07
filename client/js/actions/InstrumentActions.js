import alt from '../alt';

class InstrumentActions {
  updateSelectedInstrument (item) {
    this.dispatch(item);
  }
}

export default alt.createActions(InstrumentActions);

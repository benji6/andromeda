import alt from '../alt';

export default alt.createActions(class InstrumentActions {
  updateSelectedInstrument (item) {
    this.dispatch(item);
  }
});

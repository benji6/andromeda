import alt from '../alt';

export default alt.createActions(class ArpeggiatorActions {
  updateArpeggiatorIsOn (item) {
    this.dispatch(item);
  }
  updateSelectedPattern (item) {
    this.dispatch(item);
  }
});

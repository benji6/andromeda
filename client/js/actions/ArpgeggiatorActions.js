import alt from '../alt';

export default alt.createActions(class ArpeggiatorActions {
  updateArpeggiatorIsOn (x) {
    this.dispatch(x);
  }
});

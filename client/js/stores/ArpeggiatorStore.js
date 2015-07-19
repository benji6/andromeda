import alt from '../alt';
import InstrumentActions from '../actions/ArpeggiatorActions';

export default alt.createStore(class ArpeggiatorStore {
  constructor () {
    this.arpeggiatorIsOn = false;

    this.bindListeners({
      handleUpdateArpegiatorIsOn: InstrumentActions.UPDATE_ARPEGGIATOR_IS_ON,
    });
  }

  handleUpdateArpegiatorIsOn (item) {
    this.arpeggiatorIsOn = item;
  }
}, 'ArpeggiatorStore');

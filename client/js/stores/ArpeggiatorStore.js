import alt from '../alt';
import InstrumentActions from '../actions/ArpeggiatorActions';

export default alt.createStore(class ArpeggiatorStore {
  constructor () {
    this.arpeggiatorIsOn = false;

    this.patterns = [
      'random',
      'up',
      'down',
      'up and down',
    ];

    this.selectedPattern = 'random';

    this.bindListeners({
      handleUpdateArpegiatorIsOn: InstrumentActions.UPDATE_ARPEGGIATOR_IS_ON,
      handleUpdateSelectedPattern: InstrumentActions.UPDATE_SELECTED_PATTERN,
    });
  }

  handleUpdateArpegiatorIsOn (item) {
    this.arpeggiatorIsOn = item;
  }

  handleUpdateSelectedPattern (item) {
    this.selectedPattern = item;
  }
}, 'ArpeggiatorStore');

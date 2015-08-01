import alt from '../alt';
import InstrumentActions from '../actions/ArpeggiatorActions';

export default alt.createStore(class ArpeggiatorStore {
  constructor () {
    this.bindListeners({
      handleUpdateArpegiatorIsOn: InstrumentActions.updateArpeggiatorIsOn,
      handleUpdateSelectedPattern: InstrumentActions.updateSelectedPattern,
    });

    this.state = {
      arpeggiatorIsOn: false,
      patterns: [
        'random',
        'up',
        'down',
        'up and down',
      ],
      selectedPattern: 'up and down',
    };
  }

  handleUpdateArpegiatorIsOn (item) {
    this.state.arpeggiatorIsOn = item;
  }

  handleUpdateSelectedPattern (item) {
    this.state.selectedPattern = item;
  }
}, 'ArpeggiatorStore');

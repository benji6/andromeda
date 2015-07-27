import alt from '../alt';
import EffectActions from '../actions/EffectActions';

export default alt.createStore(class EffectStore {
  constructor () {
    this.bindListeners({
      handleUpdateSelectedEffect: EffectActions.updateSelectedEffect,
    });

    this.state = {
      effects: [
        'pingPongDelay',
        'none',
      ],
      selectedEffect: 'pingPongDelay',
    };
  }

  handleUpdateSelectedEffect (item) {
    this.state.selectedEffect = item;
  }
}, 'EffectStore');

import alt from '../alt';
import EffectActions from '../actions/EffectActions';

export default alt.createStore(class EffectStore {
  constructor () {
    this.effects = [
      'pingPongDelay',
      'none',
    ];

    this.selectedEffect = 'pingPongDelay';

    this.bindListeners({
      handleUpdateSelectedEffect: EffectActions.UPDATE_SELECTED_EFFECT,
    });
  }

  handleUpdateSelectedEffect (item) {
    this.selectedEffect = item;
  }
}, 'EffectStore');

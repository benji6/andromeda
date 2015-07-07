import alt from '../alt';

export default alt.createActions(class EffectActions {
  updateSelectedEffect (item) {
    this.dispatch(item);
  }
});

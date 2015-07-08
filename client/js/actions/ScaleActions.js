import alt from '../alt';

export default alt.createActions(class ScaleActions {
  updateScale (item) {
    this.dispatch(item);
  }
});

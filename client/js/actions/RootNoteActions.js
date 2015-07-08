import alt from '../alt';

export default alt.createActions(class RootNoteActions {
  updateRootNote (item) {
    this.dispatch(item);
  }
});

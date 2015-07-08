import alt from '../alt';
import RootNoteActions from '../actions/RootNoteActions';

export default alt.createStore(class RootNoteStore {
  constructor () {
    this.rootNote = 0;

    this.bindListeners({
      handleUpdateRootNote: RootNoteActions.UPDATE_ROOT_NOTE,
    });
  }

  handleUpdateRootNote (item) {
    this.rootNote = item;
  }
}, 'RootNoteStore');

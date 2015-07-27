import alt from '../alt';
import RootNoteActions from '../actions/RootNoteActions';

export default alt.createStore(class RootNoteStore {
  constructor () {
    this.bindListeners({
      handleUpdateRootNote: RootNoteActions.updateRootNote,
    });

    this.state = {
      rootNote: 0,
    };
  }

  handleUpdateRootNote (item) {
    this.state.rootNote = item;
  }
}, 'RootNoteStore');

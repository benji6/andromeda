import * as ReactDOM from "react-dom";
import { createStore, connect } from "st88";
import createVirtualAudioGraph from "virtual-audio-graph";
import Prometheus from "./components/Prometheus";
import notesToGraph from "./notesToGraph";
import defaultState from "./defaultState";

const audioContexts = new WeakMap();
const stores = new WeakMap();
const notes = new WeakMap();
const outputs = new WeakMap();
const virtualAudioGraphs = new WeakMap();

const updateAudio = function (state) {
  virtualAudioGraphs.get(this).update(notesToGraph(state, notes.get(this)));
};

export default class {
  constructor({ audioContext }) {
    const output = audioContext.createGain();
    const virtualAudioGraph = createVirtualAudioGraph({ audioContext, output });

    notes.set(this, []);
    const store = createStore(defaultState);

    store.subscribe(updateAudio.bind(this));

    audioContexts.set(this, audioContext);
    stores.set(this, store);
    outputs.set(this, output);
    virtualAudioGraphs.set(this, virtualAudioGraph);
  }
  connect(destination) {
    outputs.get(this).connect(destination);
  }
  disconnect(destination) {
    outputs.get(this).disconnect(destination);
  }
  noteStart(note) {
    const newNotes = [
      ...notes
        .get(this)
        .filter((note) =>
          note.hasOwnProperty("stopTime")
            ? note.stopTime > audioContexts.get(this).currentTime
            : true,
        ),
      note,
    ];
    notes.set(this, newNotes);
    updateAudio.call(this, stores.get(this).getState());
  }
  notesStart(notesToStart) {
    const newNotes = notes
      .get(this)
      .filter((note) =>
        note.hasOwnProperty("stopTime")
          ? note.stopTime > audioContexts.get(this).currentTime
          : true,
      )
      .concat(notesToStart);
    notes.set(this, newNotes);
    updateAudio.call(this, stores.get(this).getState());
  }
  noteModify(note) {
    const currentNotes = notes.get(this);
    const extantNoteIdx = currentNotes.findIndex(({ id }) => id === note.id);
    notes.set(this, [
      ...currentNotes.slice(0, extantNoteIdx),
      note,
      ...currentNotes.slice(extantNoteIdx + 1),
    ]);
    updateAudio.call(this, stores.get(this).getState());
  }
  noteStop(id) {
    const newNotes = notes.get(this).filter((note) => note.id !== id);
    notes.set(this, newNotes);
    updateAudio.call(this, stores.get(this).getState());
  }
  render(containerEl) {
    const store = stores.get(this);
    const setProp = (prop) => (val) =>
      store.dispatch((state) => Object.assign({}, state, { [prop]: val }));
    const updateProp = (prop) => (key, val) =>
      store.dispatch((state) =>
        Object.assign({}, state, {
          [prop]: Object.assign({}, state[prop], { [key]: val }),
        }),
      );
    setProp("updateFilter")(updateProp("filter"));
    setProp("updateLfo")(updateProp("lfo"));
    setProp("updateMaster")(updateProp("master"));
    setProp("updateFilter")(updateProp("filter"));
    setProp("updateOscSingle")(
      (i) => (key, val) =>
        store.dispatch((state) =>
          Object.assign({}, state, {
            oscillatorSingles: [
              ...state.oscillatorSingles.slice(0, i),
              Object.assign({}, state.oscillatorSingles[i], { [key]: val }),
              ...state.oscillatorSingles.slice(i + 1),
            ],
          }),
        ),
    );
    setProp("updateOscSuper")(
      (i) => (key, val) =>
        store.dispatch((state) =>
          Object.assign({}, state, {
            oscillatorSupers: [
              ...state.oscillatorSupers.slice(0, i),
              Object.assign({}, state.oscillatorSupers[i], { [key]: val }),
              ...state.oscillatorSupers.slice(i + 1),
            ],
          }),
        ),
    );

    ReactDOM.render(connect(store)(Prometheus), containerEl);
  }
}

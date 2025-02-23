import { createElement } from "react";
import ReactDOM from "react-dom";
import { createStore, connect } from "st88";
import ControlModule, {
  Range,
  Select,
} from "../../components/organisms/ControlModule";
import createVirtualAudioGraph, {
  createNode,
  gain as gainNode,
  oscillator,
  stereoPanner,
} from "virtual-audio-graph";

const audioContexts = new WeakMap();
const notes = new WeakMap();
const outputs = new WeakMap();
const virtualAudioGraphs = new WeakMap();
const stores = new WeakMap();

const oscBank = createNode(
  ({
    carrierDetune,
    carrierOscType,
    gain,
    frequency,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    startTime,
    stopTime,
  }) => ({
    0: gainNode(["masterPan"], { gain }),
    1: oscillator(0, {
      detune: carrierDetune,
      frequency,
      startTime,
      stopTime,
      type: carrierOscType,
    }),
    2: gainNode({ destination: "frequency", key: 1 }, { gain: 1024 }),
    3: oscillator(2, {
      detune: modulatorDetune,
      frequency: frequency * modulatorRatio,
      startTime,
      stopTime,
      type: modulatorOscType,
    }),
    masterGain: gainNode(["output"], { gain: masterGain }),
    masterPan: stereoPanner(["masterGain"], { pan: masterPan }),
  }),
);

const notesToGraph = (
  {
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
  },
  notes,
) =>
  notes.reduce(
    (acc, { frequency, gain, id, startTime, stopTime }) =>
      Object.assign({}, acc, {
        [id]: oscBank("output", {
          carrierDetune,
          carrierOscType,
          frequency,
          gain,
          masterGain,
          masterPan,
          modulatorDetune,
          modulatorOscType,
          modulatorRatio,
          startTime,
          stopTime,
        }),
      }),
    {},
  );

const updateAudio = function (state) {
  virtualAudioGraphs.get(this).update(notesToGraph(state, notes.get(this)));
};

export default class {
  constructor({ audioContext }) {
    const output = audioContext.createGain();
    const store = createStore({
      carrierDetune: 0,
      carrierOscType: "sine",
      masterGain: 1,
      masterPan: 0,
      modulatorDetune: 0,
      modulatorOscType: "sine",
      modulatorRatio: 2.5,
      output,
    });
    store.subscribe(updateAudio.bind(this));

    audioContexts.set(this, audioContext);
    stores.set(this, store);
    notes.set(this, []);
    outputs.set(this, output);

    const virtualAudioGraph = createVirtualAudioGraph({ audioContext, output });

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
    const setPropFromRangeEvent = (key) => (e) =>
      store.dispatch((state) =>
        Object.assign({}, state, { [key]: Number(e.target.value) }),
      );
    const setPropFromSelectEvent = (key) => (e) =>
      store.dispatch((state) =>
        Object.assign({}, state, { [key]: e.target.value }),
      );

    ReactDOM.render(
      connect(store)(
        ({
          carrierDetune,
          carrierOscType,
          masterGain,
          masterPan,
          modulatorDetune,
          modulatorOscType,
          modulatorRatio,
        }) =>
          createElement(
            "div",
            { style: { textAlign: "center" } },
            createElement("h2", null, "Ariadne"),
            createElement(
              ControlModule,
              null,
              createElement(Range, {
                defaultValue: masterGain,
                label: "Gain",
                max: 1.25,
                onInput: setPropFromRangeEvent("masterGain"),
              }),
              createElement(Range, {
                defaultValue: masterPan,
                label: "Pan",
                min: -1,
                onInput: setPropFromRangeEvent("masterPan"),
              }),
              createElement(
                Select,
                {
                  defaultValue: carrierOscType,
                  label: "Carrier wave",
                  onInput: setPropFromSelectEvent("carrierOscType"),
                },
                createElement("option", { value: "sawtooth" }, "Sawtooth"),
                createElement("option", { value: "sine" }, "Sine"),
                createElement("option", { value: "square" }, "Square"),
                createElement("option", { value: "triangle" }, "Triangle"),
              ),
              createElement(
                Select,
                {
                  defaultValue: modulatorOscType,
                  label: "Modulator wave",
                  onInput: setPropFromSelectEvent("modulatorOscType"),
                },
                createElement("option", { value: "sawtooth" }, "Sawtooth"),
                createElement("option", { value: "sine" }, "Sine"),
                createElement("option", { value: "square" }, "Square"),
                createElement("option", { value: "triangle" }, "Triangle"),
              ),
              createElement(Range, {
                defaultValue: carrierDetune,
                label: "Carrier detune",
                max: 32,
                min: -32,
                onInput: setPropFromRangeEvent("carrierDetune"),
              }),
              createElement(Range, {
                defaultValue: modulatorRatio,
                label: "Modulator freq",
                max: 8,
                min: 0.1,
                onInput: setPropFromRangeEvent("modulatorRatio"),
              }),
              createElement(Range, {
                defaultValue: modulatorDetune,
                label: "Modulator detune",
                max: 128,
                min: -128,
                onInput: setPropFromRangeEvent("modulatorDetune"),
              }),
            ),
          ),
      ),
      containerEl,
    );
  }
}

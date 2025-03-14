import {
  createNode,
  gain,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import ariadneSlice from "./ariadneSlice";
import { createSelector } from "@reduxjs/toolkit";
import { Note } from "../types";
import controlPadSlice from "./controlPadSlice";
import keyboardSlice from "./keyboardSlice";

const oscBank = createNode(
  ({
    carrierDetune,
    carrierOscType,
    gain: gainValue,
    frequency,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
  }: {
    carrierDetune: number;
    carrierOscType: OscillatorType;
    gain: number;
    frequency: number;
    masterGain: number;
    masterPan: number;
    modulatorDetune: number;
    modulatorOscType: OscillatorType;
    modulatorRatio: number;
  }) => ({
    0: gain(["masterPan"], { gain: gainValue / 2 }),
    1: oscillator(0, {
      detune: carrierDetune,
      frequency,
      type: carrierOscType,
    }),
    2: gain({ destination: "frequency", key: 1 }, { gain: 1024 }),
    3: oscillator(2, {
      detune: modulatorDetune,
      frequency: frequency * modulatorRatio,
      type: modulatorOscType,
    }),
    masterGain: gain([OUTPUT], { gain: masterGain }),
    masterPan: stereoPanner(["masterGain"], { pan: masterPan }),
  }),
);

const ariadne = createNode(
  ({
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    notes,
  }: {
    carrierDetune: number;
    carrierOscType: OscillatorType;
    masterGain: number;
    masterPan: number;
    modulatorDetune: number;
    modulatorOscType: OscillatorType;
    modulatorRatio: number;
    notes: Note[];
  }) =>
    notes.reduce(
      (acc, { frequency, gain, id }) =>
        Object.assign({}, acc, {
          [id]: oscBank(OUTPUT, {
            carrierDetune,
            carrierOscType,
            frequency,
            gain,
            masterGain,
            masterPan,
            modulatorDetune,
            modulatorOscType,
            modulatorRatio,
          }),
        }),
      {},
    ),
);

const ariadneActiveNotesSelector = createSelector(
  controlPadSlice.selectors.instrument,
  controlPadSlice.selectors.currentNote,
  keyboardSlice.selectors.instrument,
  keyboardSlice.selectors.currentNotes,
  (
    controlPadInstrument,
    controlPadNote,
    keyboardInstrument,
    keyboardNotes,
  ): Note[] => {
    const notes = keyboardInstrument === "Ariadne" ? keyboardNotes : [];
    if (controlPadInstrument === "Ariadne" && controlPadNote)
      notes.push(controlPadNote);
    return notes;
  },
);

export default createSelector(
  ariadneActiveNotesSelector,
  ariadneSlice.selectors.carrierDetune,
  ariadneSlice.selectors.carrierOscType,
  ariadneSlice.selectors.masterGain,
  ariadneSlice.selectors.masterPan,
  ariadneSlice.selectors.modulatorDetune,
  ariadneSlice.selectors.modulatorOscType,
  ariadneSlice.selectors.modulatorRatio,
  (
    notes,
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
  ) => {
    if (!notes.length) return;
    return ariadne(0, {
      carrierDetune,
      carrierOscType,
      masterGain,
      masterPan,
      modulatorDetune,
      modulatorOscType,
      modulatorRatio,
      notes,
    });
  },
);

import {
  biquadFilter,
  createNode,
  gain as gainNode,
  oscillator,
  OUTPUT,
  stereoPanner,
} from "virtual-audio-graph";
import pitchToFrequency from "../audioHelpers/pitchToFrequency";
import prometheusSlice, { PrometheusState } from "./prometheusSlice";
import { Note } from "../types";
import { IVirtualAudioNodeGraph } from "virtual-audio-graph/dist/types";

import { createSelector } from "@reduxjs/toolkit";
import controlPadSlice from "./controlPadSlice";
import keyboardSlice from "./keyboardSlice";

const prometheusActiveNotesSelector = createSelector(
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
    let notes = keyboardInstrument === "Prometheus" ? keyboardNotes : [];
    if (controlPadInstrument === "Prometheus" && controlPadNote)
      notes = [...keyboardNotes, controlPadNote];
    return notes;
  },
);

const frequencyToPitch = (frequency: number) => Math.log2(frequency / 440) * 12;

const lfoNode = createNode(
  ({
    frequency,
    gain,
    type,
  }: {
    frequency: number;
    gain: number;
    type: OscillatorType;
  }) => ({
    0: gainNode(OUTPUT, { gain }),
    1: oscillator(0, { frequency, type }),
  }),
);

const osc = createNode(
  ({
    detune = 0,
    frequency,
    gain,
    pan,
    pitch,
    type,
  }: {
    detune: number;
    frequency: number;
    gain: number;
    pan: number;
    pitch: number;
    type: OscillatorType;
  }) => ({
    0: gainNode(OUTPUT, { gain }),
    1: stereoPanner(0, { pan }),
    2: oscillator(1, {
      detune,
      frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
      type,
    }),
  }),
);

const prometheus = createNode(
  ({
    filter,
    lfo,
    master,
    oscillatorSingles,
    oscillatorSupers,
    notes,
  }: PrometheusState & { notes: Note[] }) =>
    notes.reduce(
      (acc: IVirtualAudioNodeGraph, { frequency, gain, id }) => {
        const noteGainId = `${id}-noteGain`;
        acc[noteGainId] = gainNode("filter", { gain });

        for (const oscillatorSingle of oscillatorSingles) {
          acc[`${id}-oscSingle-${oscillatorSingle.id}`] = osc(noteGainId, {
            ...oscillatorSingle,
            frequency,
          });
        }

        for (const oscillatorSuper of oscillatorSupers) {
          const { numberOfOscillators, type } = oscillatorSuper;
          for (let j = 0; j < numberOfOscillators; j++) {
            acc[`${id}-oscSuper-${oscillatorSuper.id}-${j}`] = osc(noteGainId, {
              detune:
                oscillatorSuper.detune +
                (j - Math.floor(numberOfOscillators / 2)) *
                  oscillatorSuper.spread,
              frequency,
              gain: oscillatorSuper.gain,
              pan: oscillatorSuper.pan,
              pitch: oscillatorSuper.pitch,
              type:
                type === "random"
                  ? (["sawtooth", "sine", "square", "triangle"] as const)[
                      Math.floor(Math.random() * 4)
                    ]
                  : type,
            });
          }
        }

        return acc;
      },
      {
        filter: biquadFilter("masterPan", filter),
        lfo: lfoNode({ destination: "frequency", key: "filter" }, lfo),
        masterGain: gainNode(OUTPUT, { gain: master.gain }),
        masterPan: stereoPanner("masterGain", { pan: master.pan }),
      },
    ),
);

export default createSelector(
  prometheusActiveNotesSelector,
  prometheusSlice.selectors.filter,
  prometheusSlice.selectors.lfo,
  prometheusSlice.selectors.master,
  prometheusSlice.selectors.oscillatorSingles,
  prometheusSlice.selectors.oscillatorSupers,
  (notes, filter, lfo, master, oscillatorSingles, oscillatorSupers) => {
    if (!notes.length) return;
    return prometheus(0, {
      filter,
      lfo,
      master,
      oscillatorSingles,
      oscillatorSupers,
      notes,
    });
  },
);

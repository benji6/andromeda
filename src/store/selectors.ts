import { createSelector } from "@reduxjs/toolkit";
import controlPadSlice from "./controlPadSlice";
import keyboardSlice from "./keyboardSlice";
import { Note } from "../types";

export const ariadneActiveNotesSelector = createSelector(
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

export const prometheusActiveNotesSelector = createSelector(
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
    const notes = keyboardInstrument === "Prometheus" ? keyboardNotes : [];
    if (controlPadInstrument === "Prometheus" && controlPadNote)
      notes.push(controlPadNote);
    return notes;
  },
);

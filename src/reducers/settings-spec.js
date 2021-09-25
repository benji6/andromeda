import test from "tape";
import reducer from "./settings";
import { bpmSet, rootNoteSet, selectedScaleSet } from "../actions";

const reducerName = "settings reducer";

test(`${reducerName} returns initial state`, (t) => {
  t.deepEqual(reducer(undefined, {}), {
    bpm: 140,
    noteDuration: 0.42857142857142855,
    rootNote: 0,
    selectedScale: "pentatonic",
  });
  t.end();
});

test(`${reducerName} bpmSet`, (t) => {
  t.deepEqual(
    reducer({ bpm: 140, noteDuration: 0.42857142857142855 }, bpmSet(120)),
    { bpm: 120, noteDuration: 0.5 }
  );
  t.end();
});

test(`${reducerName} rootNoteSet`, (t) => {
  t.deepEqual(reducer({ rootNote: 0 }, rootNoteSet(3)), { rootNote: 3 });
  t.end();
});

test(`${reducerName} selectedScaleSet`, (t) => {
  t.deepEqual(
    reducer({ selectedScale: "pentatonic" }, selectedScaleSet("wholetone")),
    { selectedScale: "wholetone" }
  );
  t.end();
});

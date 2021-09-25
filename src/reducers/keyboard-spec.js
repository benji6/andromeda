import test from "tape";
import reducer, { initialState } from "./keyboard";
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from "../actions";

const reducerName = "keyboard reducer";

test(`${reducerName} returns initial state`, (t) => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} keyboardMonophonicSet`, (t) => {
  t.deepEqual(reducer({ monophonic: false }, keyboardMonophonicSet(true)), {
    monophonic: true,
  });
  t.deepEqual(reducer({ monophonic: true }, keyboardMonophonicSet(false)), {
    monophonic: false,
  });
  t.end();
});

test(`${reducerName} keyboardInstrumentSet`, (t) => {
  t.deepEqual(reducer({ instrument: "foo" }, keyboardInstrumentSet("bar")), {
    instrument: "bar",
  });
  t.end();
});

test(`${reducerName} keyboardOctaveSet`, (t) => {
  t.deepEqual(reducer({ octave: -1 }, keyboardOctaveSet(1)), { octave: 1 });
  t.end();
});

test(`${reducerName} keyboardVolumeSet`, (t) => {
  t.deepEqual(reducer({ volume: 0.9 }, keyboardVolumeSet(0.5)), {
    volume: 0.5,
  });
  t.end();
});

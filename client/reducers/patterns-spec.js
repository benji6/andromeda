import test from 'tape';
import reducer, {initialState} from './patterns';
import {activePatternCellClick,
        updateActivePatternActivePosition,
        updateActivePatternChannel,
        updateActivePatternOctave,
        updateActivePatternXLength} from '../actions';

const reducerName = 'patterns';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer handles active pattern cell click`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = {x: 1, y: 2};
  const testState = [...initialState.slice(0, activePatternIndex),
                     {...activePattern, notes: [value]},
                     ...initialState.slice(activePatternIndex + 1)];
  t.deepEqual(reducer(undefined, activePatternCellClick(value)),
              testState);
  t.deepEqual(reducer(testState, activePatternCellClick(value)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, notes: []},
               ...initialState.slice(activePatternIndex + 1)]);
  t.end();
});

test(`${reducerName} reducer updates active pattern active position`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 3;

  t.deepEqual(reducer(undefined, updateActivePatternActivePosition(value)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, activePosition: value},
               ...initialState.slice(activePatternIndex + 1)]);
  t.end();
});

test(`${reducerName} reducer updateActivePatternChannel`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 3;

  t.deepEqual(reducer(undefined, updateActivePatternChannel(value)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, channel: value},
               ...initialState.slice(activePatternIndex + 1)]);
  t.end();
});

test(`${reducerName} reducer updates active pattern octave`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 5;

  t.deepEqual(reducer(undefined, updateActivePatternOctave(value)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, octave: value},
               ...initialState.slice(activePatternIndex + 1)]);
  t.end();
});

test(`${reducerName} reducer updates active pattern xLength`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 5;

  t.deepEqual(reducer(undefined, updateActivePatternXLength(value)),
              [...initialState.slice(0, activePatternIndex),
               {...activePattern, xLength: value},
               ...initialState.slice(activePatternIndex + 1)]);
  t.end();
});

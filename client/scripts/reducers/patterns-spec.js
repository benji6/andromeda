import {repeat} from 'ramda';
import test from 'tape';
import reducer, {initialState} from './patterns';
import {updateActivePatternInstrument,
        updateActivePatternNotes} from '../actions';

test('patterns reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test('patterns reducer updates active pattern notes', t => {
  const patterns = [
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'tubaphone',
    },
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'keyboard',
    },
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'nothing',
    },
  ];
  const testState = {
    patterns,
    activePattern: 1,
  };
  const newNotes = [repeat(repeat({selected: true, active: false}, 8), 8)];
  t.deepEqual(reducer(testState, updateActivePatternNotes(newNotes)),
              {...testState, patterns: [patterns[0], {...patterns[1], notes: newNotes}, patterns[2]]});
  t.end();
});

test('patterns reducer updates active pattern instrument', t => {
  const patterns = [
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'tubaphone',
    },
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'keyboard',
    },
    {
      notes: [repeat(repeat({selected: false, active: false}, 8), 8)],
      instrument: 'nothing',
    },
  ];
  const testState = {
    patterns,
    activePattern: 1,
  };
  const newInstrument = 'bass';
  t.deepEqual(reducer(testState, updateActivePatternInstrument(newInstrument)),
              {...testState, patterns: [patterns[0], {...patterns[1], instrument: newInstrument}, patterns[2]]});
  t.end();
});

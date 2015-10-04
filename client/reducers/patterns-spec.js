import test from 'tape';
import {update} from 'ramda';
import reducer, {initialState} from './patterns';
import {activePatternCellClick,
        updateActivePatternActivePosition,
        updateActivePatternInstrument} from '../actions';

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
  const testState = update(activePatternIndex,
                           {...activePattern, notes: [value]},
                           initialState);
  t.deepEqual(reducer(undefined, activePatternCellClick(value)),
              testState);
  t.deepEqual(reducer(testState, activePatternCellClick(value)),
              update(activePatternIndex,
                     {...activePattern, notes: []},
                     initialState));
  t.end();
});

test(`${reducerName} reducer updates active pattern instrument`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 'tubaphone';

  t.deepEqual(reducer(undefined, updateActivePatternInstrument(value)),
              update(activePatternIndex,
                     {...activePattern, instrument: value},
                     initialState));
  t.end();
});

test(`${reducerName} reducer updates active pattern active position`, t => {
  const activePatternIndex = 0;
  const activePattern = initialState[activePatternIndex];
  const value = 3;

  t.deepEqual(reducer(undefined, updateActivePatternActivePosition(value)),
              update(activePatternIndex,
                     {...activePattern, activePosition: value},
                     initialState));
  t.end();
});

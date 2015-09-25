import {repeat} from 'ramda';
import test from 'tape';
import reducer, {initialState} from './patterns';
import {updateActivePattern} from '../actions';
test('patterns reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test('patterns reducer updates active pattern', t => {
  const testState = [repeat(repeat({selected: true,
                                    active: false}, 8), 8)];
  t.deepEqual(reducer(undefined, updateActivePattern(testState)), {...initialState, patterns: [testState]});
  t.end();
});

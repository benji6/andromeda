import test from 'tape';
import reducer, {initialState} from './activePattern';
import {updateActivePattern} from '../actions';

const reducerName = 'activePattern';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updates state`, t => {
  t.deepEqual(reducer(undefined, updateActivePattern(5)),
              5);
  t.end();
});

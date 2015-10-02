const reducerName = 'scale';

import test from 'tape';
import reducer, {initialState} from './scale';
import {updateSelectedScale} from '../actions';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updates root note`, t => {
  t.deepEqual(reducer(undefined, updateSelectedScale('wholetone')), {...initialState, scaleName: 'wholetone'});
  t.end();
});

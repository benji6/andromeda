import test from 'tape';
import reducer, {initialState} from './scale';
import {updateSelectedScale} from '../actions';

const reducerName = 'scale';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

test(`${reducerName} reducer updates selected scale`, t => {
  t.deepEqual(reducer(undefined, updateSelectedScale('wholetone')), {...initialState, scaleName: 'wholetone'});
  t.end();
});

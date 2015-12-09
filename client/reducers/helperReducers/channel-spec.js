import test from 'tape';
import reducer, {initialState} from './channel';

const reducerName = 'channel';

test(`${reducerName} reducer returns initial state`, t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

import test from 'tape';
import reducer, {initialState} from './instruments';

test('rootNote reducer returns initial state', t => {
  t.deepEqual(reducer(undefined, {}), initialState);
  t.deepEqual(reducer(undefined, {}), initialState);
  t.end();
});

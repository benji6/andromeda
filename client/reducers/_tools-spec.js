import test from 'tape';
import {computeId} from './_tools';

test(`reducer tools: computeId`, t => {
  t.equal(computeId([]), 0);
  t.equal(computeId([{id: 1}]), 2);
  t.equal(computeId([{id: 42}]), 43);
  t.end();
});

import test from 'tape';
import computeAscending from './computeAscending';

test('computeAscending', t => {
  t.equals(computeAscending('up', 2, 3, false), true);
  t.equals(computeAscending('down', 2, 3, false), false);
  t.equals(computeAscending('up and down', 2, 3, false), false);
  t.equals(computeAscending('up and down', 0, 3, false), true);
  t.equals(computeAscending('up and down', 2, 3, true), false);
  t.equals(computeAscending('up and down', 1, 3, true), true);
  t.end();
});

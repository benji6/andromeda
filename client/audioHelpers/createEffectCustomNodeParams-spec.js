import test from 'tape';
import createEffectCustomNodeParams from './createEffectCustomNodeParams';

test('createEffectCustomNodeParams', t => {
  t.deepEquals(createEffectCustomNodeParams('testEffect', 0),
               ['testEffect', 'output']);
  t.deepEquals(createEffectCustomNodeParams('reverb', 2),
               ['reverb', 1]);
  t.end();
});

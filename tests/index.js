// import 'web-audio-test-api';
import React from 'react/addons';
import test from 'tape';
import UpgradeBrowserView from '../client/scripts/components/atoms/UpgradeBrowserView';
// import ModalOKButton from '../client/scripts/components/atoms/ModalOKButton';

const {addons: {TestUtils}} = React;
const shallowRenderer = TestUtils.createRenderer();

shallowRenderer.render(React.createElement(UpgradeBrowserView, { className: 'MyComponent' }, 'some child text'));

const component = shallowRenderer.getRenderOutput();

test('UpgradeBrowserView', function (t) {
  t.equal(component.type, 'h1');
  t.equal(component.props.className, 'upgrade-browser-message');
  t.end();
});

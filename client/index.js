import React from 'react';
import {Provider} from 'react-redux';
import './customVirtualNodes/defineNodes';
import './keyboard';
import UpgradeBrowserView from './components/pages/UpgradeBrowserView';
import render from './tools/render';
import store from './store';
import routes from './routes';

const app = <Provider store={store}>{routes}</Provider>;

if (navigator.serviceWorker) {
  render(app);
} else {
  render(<UpgradeBrowserView />);
}

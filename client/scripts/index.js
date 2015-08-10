import React from 'react'; // eslint-disable-line no-unused-vars
import './customVirtualNodes/defineNodes';
import PerformanceView from './components/templates/PerformanceView';
import UpgradeBrowserView from './components/templates/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';
import store from './store';



import { Provider } from 'react-redux';



if (navigator.serviceWorker) {
  render(
    <Provider store={store}>
      {() => <PerformanceView />}
    </Provider>
  );
} else {
  render(<UpgradeBrowserView />);
}

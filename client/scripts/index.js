import React from 'react'; // eslint-disable-line no-unused-vars
// import {Provider} from 'react-redux';
import './customVirtualNodes/defineNodes';
// import PatternEditor from './components/templates/PatternEditor';
import PerformanceView from './components/templates/PerformanceView';
import UpgradeBrowserView from './components/templates/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';
// import store from './store';

if (navigator.serviceWorker) {
  // render(
  //   <Provider store={store}>
  //     {() => <PatternEditor />}
  //   </Provider>
  // );
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

import React from 'react'; // eslint-disable-line no-unused-vars
import './customVirtualNodes/defineNodes';
import './keyboard';
import PerformanceView from './components/pages/PerformanceView';
import UpgradeBrowserView from './components/pages/UpgradeBrowserView';
import render from './tools/render';

if (navigator.serviceWorker) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

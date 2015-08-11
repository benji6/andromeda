import React from 'react'; // eslint-disable-line no-unused-vars
import './customVirtualNodes/defineNodes';
import PerformanceView from './components/templates/PerformanceView';
import UpgradeBrowserView from './components/templates/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';

if (navigator.serviceWorker) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

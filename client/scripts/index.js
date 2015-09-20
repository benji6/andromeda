import React from 'react'; // eslint-disable-line no-unused-vars
import './customVirtualNodes/defineNodes';
import './keyboard';
import PerformanceView from './components/templates/PerformanceView';
import UpgradeBrowserView from './components/templates/UpgradeBrowserView';
import render from './tools/render';

if (navigator.serviceWorker) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

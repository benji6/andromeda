import './customVirtualNodes/defineNodes';
import './alt';
import './stores/ArpeggiatorStore';
import React from 'react'; // eslint-disable-line no-unused-vars
import PerformanceView from './components/pages/PerformanceView';
import UpgradeBrowserView from './components/pages/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';

if (navigator['serviceWorker']) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

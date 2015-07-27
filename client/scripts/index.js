import './customVirtualNodes/defineNodes';
import './alt';
import './stores/ArpeggiatorStore';
import React from 'react'; // eslint-disable-line no-unused-vars
import PerformanceView from './components/PerformanceView';
import UpgradeBrowserView from './components/atoms/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';

if ('serviceWorker' in navigator) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

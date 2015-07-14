import './customVirtualNodes/defineNodes';
import './alt';
import React from 'react';
import PerformanceView from './components/PerformanceView';
import UpgradeBrowserView from './components/UpgradeBrowserView';
import './keyboard';
import render from './tools/render';

if ('serviceWorker' in navigator) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

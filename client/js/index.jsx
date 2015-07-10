import React from 'react';
import alt from './alt';
import PerformanceView from './components/PerformanceView';
import UpgradeBrowserView from './components/UpgradeBrowserView';
import keyboard from './keyboard';
import render from './tools/render';

if ('serviceWorker' in navigator) {
  // jshint ignore: start
  render(<PerformanceView />);
  // jshint ignore: end
} else {
  // jshint ignore: start
  render(<UpgradeBrowserView />);
  // jshint ignore: end
}

import React from 'react';
import alt from './alt';
import PerformanceView from './components/PerformanceView';
import UpgradeBrowserView from './components/UpgradeBrowserView';
import keyboard from './keyboard';
import render from './tools/render';

if ('serviceWorker' in navigator) {
  render(<PerformanceView />);
} else {
  render(<UpgradeBrowserView />);
}

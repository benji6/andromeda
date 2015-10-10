import React from 'react'; // eslint-disable-line
import ControlPad from '../atoms/ControlPad';
import PerformanceMenu from '../organisms/PerformanceMenu';
import Navigation from '../organisms/Navigation';

export default () =>
  <div>
    <Navigation />
    <div className="text-center">
      <ControlPad />
    </div>
    <PerformanceMenu />
  </div>;

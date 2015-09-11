import React from 'react'; // eslint-disable-line
import ControlPad from '../atoms/ControlPad';
import PerformanceMenu from '../templates/PerformanceMenu';

export default () => (
  <div>
    <div className="center">
      <ControlPad />
    </div>
    <PerformanceMenu />
  </div>
);

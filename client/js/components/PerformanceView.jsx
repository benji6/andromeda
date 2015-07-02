import React from 'react';
import ControlPad from './ControlPad';
import PerformanceMenu from './PerformanceMenu';

class PerformanceView extends React.Component {
  render () {
    return <div>
      <ControlPad />
      <PerformanceMenu />
    </div>;
  }
}

export default PerformanceView;

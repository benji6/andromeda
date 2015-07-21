import React from 'react';
import ControlPad from './atoms/ControlPad';
import PerformanceMenu from './PerformanceMenu';

class PerformanceView extends React.Component {
  render () {
    return <div>
      <div className="center">
        <ControlPad />
      </div>
      <PerformanceMenu />
    </div>;
  }
}

export default PerformanceView;

import React from 'react';
import ControlPad from './ControlPad';
import PerformanceMenu from './PerformanceMenu';

class PerformanceView extends React.Component {
  render () {
    // jshint ignore: start
    return <div>
      <ControlPad />
      <PerformanceMenu />
    </div>;
    // jshint ignore: end
  }
}

export default PerformanceView;

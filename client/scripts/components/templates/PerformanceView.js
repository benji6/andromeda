import React from 'react';
import ControlPad from '../atoms/ControlPad';
import PerformanceMenu from '../molecules/PerformanceMenu';

export default class extends React.Component {
  render () {
    return <div>
      <div className="center">
        <ControlPad />
      </div>
      <PerformanceMenu />
    </div>;
  }
}

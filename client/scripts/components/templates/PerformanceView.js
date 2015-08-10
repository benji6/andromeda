import React from 'react';
import ControlPad from '../atoms/ControlPad';
import PerformanceMenu from '../molecules/PerformanceMenu';
import {connect} from 'react-redux';

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

const select = state => state;

export default connect(select)(PerformanceView);

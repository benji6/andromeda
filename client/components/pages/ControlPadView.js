import {identity} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import ControlPad from '../atoms/ControlPad';
import PerformanceMenu from '../organisms/PerformanceMenu';
import Navigation from '../organisms/Navigation';

export default connect(identity)(({controlPad: {instrument}}) =>
  <div>
    <Navigation />
    <div className="text-center">
      <ControlPad instrument={instrument}/>
    </div>
    <PerformanceMenu />
  </div>);

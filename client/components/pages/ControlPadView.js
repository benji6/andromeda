import {identity} from 'ramda';
import React from 'react';
import {connect} from 'react-redux';
import ControlPad from '../organisms/ControlPad';
import PerformanceMenu from '../organisms/PerformanceMenu';
import Navigation from '../organisms/Navigation';

export default connect(identity)(({controlPad}) =>
  <div>
    <Navigation />
    <div className="text-center">
      <ControlPad {...controlPad}/>
    </div>
    <PerformanceMenu />
  </div>);

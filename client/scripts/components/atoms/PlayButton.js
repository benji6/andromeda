/* global R */
import React from 'react';
import {connect} from 'react-redux';
import {updatePlaying} from '../../actions';

const {identity} = R;

@connect(identity)
export default class extends React.Component {
  render () {
    const {dispatch, playing} = this.props;
    return <div className={`play-button ${playing ? 'selected' : ''}`}
                onClick={() => dispatch(updatePlaying(!playing))}></div>;
  }
}

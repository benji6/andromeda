import React from 'react';

export default class PerformanceMenu extends React.Component {
  render () {
    return <div className="performance-menu">
      <a className="btn">Instrument</a>
      <a className="btn">Effects</a>
      <a className="btn">Root Note</a>
      <a className="btn">Scale</a>
    </div>;
  }
}

import React from 'react';
import {fromEvent} from 'most';

export default class PerformanceMenu extends React.Component {
  componentDidMount () {
    const instrumentButton = document.querySelector('#instrument-button');

    fromEvent('click', instrumentButton)
      .observe(console.log.bind(console));
  }

  render () {
    return <div className="performance-menu">
      <button id="instrument-button">Instrument</button>
      <button>Effects</button>
      <button>Root Note</button>
      <button>Scale</button>
    </div>;
  }
}

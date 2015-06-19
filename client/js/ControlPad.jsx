import React from 'react';

export default () => {
  class ControlPad extends React.Component {
    render () {
      return <canvas className="touch-pad"></canvas>;
    }
  }

  React.render(<ControlPad />, document.querySelector('#app'));
};

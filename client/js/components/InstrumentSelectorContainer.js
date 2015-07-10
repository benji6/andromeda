import AltContainer from 'alt/AltContainer';
import React from 'react';
import InstrumentStore from '../stores/InstrumentStore';
import InstrumentSelector from './InstrumentSelector';

export default React.createClass({
  render() {
    return (
      <AltContainer store={InstrumentStore}>
        <InstrumentSelector />
      </AltContainer>
    );
  },
});

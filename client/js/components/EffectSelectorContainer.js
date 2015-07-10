import AltContainer from 'alt/AltContainer';
import React from 'react';
import EffectStore from '../stores/EffectStore';
import EffectSelector from './EffectSelector';

export default React.createClass({
  render() {
    return (
      <AltContainer store={EffectStore}>
        <EffectSelector />
      </AltContainer>
    );
  },
});

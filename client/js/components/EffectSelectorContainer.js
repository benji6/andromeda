import AltContainer from 'alt/AltContainer';
import React from 'react';
import EffectStore from '../stores/EffectStore';
import EffectSelector from './EffectSelector';

export default class EffectSelectorContainer extends React.Component {
  render() {
    return (
      <AltContainer store={EffectStore}>
        <EffectSelector />
      </AltContainer>
    );
  }
}

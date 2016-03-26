import React from 'react'
import Selector from './Selector'
import ButtonSecondary from '../atoms/ButtonSecondary'

export default x =>
  <Selector {...{...x}}>
    <ButtonSecondary to={`/plugins/instruments/${x.defaultValue}`}>
      edit
    </ButtonSecondary>
  </Selector>

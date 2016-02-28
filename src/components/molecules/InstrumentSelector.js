import React from 'react'
import Selector from './Selector'
import ButtonSecondary from '../atoms/ButtonSecondary'

export default ({...props}) =>
  <Selector {...{...props}}>
    <ButtonSecondary to={`/plugins/instruments/${props.defaultValue}`}>
      edit
    </ButtonSecondary>
  </Selector>

import React from 'react'
import ControlContainer from './ControlContainer'
import {height, padding, width} from './constants'

export default ({label, ...props}) => <ControlContainer {...{
  style: {
    fontSize: height,
    padding,
  }
}}>
  {label}&nbsp;
  <select {...{style: {width}, ...props}} />
</ControlContainer>

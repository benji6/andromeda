import React from 'react'

export default ({...props}) => <div {...{
  style: {display: 'inline-block', textAlign: 'right'},
  ...props,
}}/>

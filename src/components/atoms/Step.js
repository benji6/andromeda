import React from 'react'

export default ({onClick, selected}) => <button
  className={`step ${selected === true ? 'step--selected' : ''}`}
  onClick={onClick}
/>

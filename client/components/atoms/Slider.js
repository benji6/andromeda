import React from 'react'

export default ({output, ...props}) =>
  <div className="slider">
    <div>
      <output>{output}</output>
    </div>
    <input type="range"
           {...props} />
  </div>

import React from 'react'
import LinkExternal from '../atoms/LinkExternal'

export default () =>
  <div className='About'>
    <h1 className='About__Title'>About</h1>
    <p>Elemental is a pluggable digital audio workstation in development built on open web technologies</p>
    <p>
      All the code is open source and hosted on&nbsp;
      <LinkExternal href='https://github.com/benji6/elemental'>
        GitHub
      </LinkExternal>
    </p>
    <p>
      If you would like to report a bug or request a feature raise an&nbsp;
      <LinkExternal href='https://github.com/benji6/elemental/issues'>
        issue
      </LinkExternal>
    </p>
    <p>
      Contributions, issues, feedback and suggestions are all very welcome!
    </p>
  </div>

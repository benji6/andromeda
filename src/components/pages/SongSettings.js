import React from 'react'
import FullButton from '../atoms/FullButton'

export default _ => {
  return <div className='flex-column text-center'>
    <h2 className='text-center'>Song Settings</h2>
    <p>Nothing to see here...</p>
    <div>
      <FullButton to='/controllers/song'>OK</FullButton>
    </div>
  </div>
}

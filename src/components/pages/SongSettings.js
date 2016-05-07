import React from 'react'
import ButtonPrimary from '../atoms/ButtonPrimary'

export default _ => {
  return <div className='flex-column text-center'>
    <h2 className='text-center'>Song Settings</h2>
    <p>Nothing to see here...</p>
    <div>
      <ButtonPrimary to='/controllers/song'>OK</ButtonPrimary>
    </div>
  </div>
}

import React from 'react'

const GumroadButton = ({ checkoutUrl }) => {
  if (!checkoutUrl) return null

  return (
    <a
      href={checkoutUrl}
      className='gumroad-button px-4 me-2 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'>
      Purchase on
    </a>
  )
}

export default GumroadButton

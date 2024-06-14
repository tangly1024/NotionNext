import { useEffect } from 'react'

const LemonSqueezyButton = ({ checkoutUrl }) => {
  useEffect(() => {
    // Append Lemon Squeezy script to the document
    const script = document.createElement('script')
    script.src = 'https://assets.lemonsqueezy.com/lemon.js'
    script.defer = true
    document.body.appendChild(script)

    // Initialize Lemon Squeezy overlay once the script is loaded
    script.onload = () => {
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy()
      }
    }

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Render null if checkoutUrl is null
  if (!checkoutUrl) return null

  // Otherwise, render the button
  return (
    <a
      href={checkoutUrl}
      className='lemonsqueezy-button inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'>
      Purchase
    </a>
  )
}

export default LemonSqueezyButton

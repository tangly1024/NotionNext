import { useEffect, useRef, useState } from 'react'

const CanvasEmail = ({ email, className = '' }) => {
  const canvasRef = useRef(null)
  const textRef = useRef(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!textRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const textElement = textRef.current

    // Get computed styles from the hidden text element
    const style = window.getComputedStyle(textElement)
    const font = style.font
    const color = style.color

    // Set canvas font and measure text
    ctx.font = font
    const metrics = ctx.measureText(email)
    const fontSize = parseInt(style.fontSize)
    const lineHeight = fontSize * 1.2

    // Set canvas dimensions
    const scale = window.devicePixelRatio || 1
    canvas.width = metrics.width * scale
    canvas.height = lineHeight * scale
    canvas.style.width = `${metrics.width}px`
    canvas.style.height = `${lineHeight}px`

    // Redraw with high DPI support
    ctx.scale(scale, scale)
    ctx.font = font
    ctx.fillStyle = color
    ctx.textBaseline = 'top' // Changed to 'top' for better vertical alignment
    ctx.fillText(email, 0, 0)

    // Handle copy to clipboard
    const handleCopy = e => {
      e.preventDefault()
      navigator.clipboard.writeText(email).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }

    canvas.style.cursor = 'pointer'
    canvas.addEventListener('click', handleCopy)
    return () => canvas.removeEventListener('click', handleCopy)
  }, [email])

  return (
    <span
      className={`relative inline-block align-middle ${className}`}
      style={{ lineHeight: 'normal' }}>
      {/* Hidden span for measuring text metrics */}
      <span
        ref={textRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          font: 'inherit',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 'normal'
        }}></span>

      {/* Canvas that displays the text */}
      <canvas
        ref={canvasRef}
        className='inline-block align-middle'
        style={{
          verticalAlign: 'middle',
          backgroundColor: 'transparent',
          pointerEvents: 'auto',
          font: 'inherit',
          lineHeight: 'normal',
          display: 'inline-block',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          MozUserSelect: 'none',
          KhtmlUserSelect: 'none'
        }}
        title={isCopied ? 'Copied!' : 'Click to copy'}
        aria-label={`Email: ${email}`}
      />
    </span>
  )
}

export default CanvasEmail

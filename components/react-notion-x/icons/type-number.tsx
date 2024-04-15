import * as React from 'react'

function SvgTypeNumber(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 14 14' {...props}>
      <path d='M4.462 0c-.595 0-1.078.482-1.078 1.078v2.306H1.078a1.078 1.078 0 100 2.155h2.306v2.922H1.078a1.078 1.078 0 100 2.155h2.306v2.306a1.078 1.078 0 002.155 0v-2.306H8.46v2.306a1.078 1.078 0 002.156 0v-2.306h2.306a1.078 1.078 0 100-2.155h-2.306V5.539h2.306a1.078 1.078 0 100-2.155h-2.306V1.078a1.078 1.078 0 00-2.156 0v2.306H5.54V1.078C5.54.482 5.056 0 4.461 0zm1.077 8.46V5.54H8.46v2.92H5.54z' />
    </svg>
  )
}

export default SvgTypeNumber

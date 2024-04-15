import * as React from 'react'

function SvgCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 14 14' {...props}>
      <path d='M5.5 12L14 3.5 12.5 2l-7 7-4-4.003L0 6.499z' />
    </svg>
  )
}

export default SvgCheck

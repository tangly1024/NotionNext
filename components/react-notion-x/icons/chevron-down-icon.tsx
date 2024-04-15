import * as React from 'react'

export const ChevronDownIcon = (props) => {
  const { className, ...rest } = props
  return (
    <svg className={className} {...rest} viewBox='0 0 30 30' width='10'>
      <polygon points='15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 '></polygon>
    </svg>
  )
}

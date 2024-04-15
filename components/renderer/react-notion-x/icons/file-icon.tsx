import * as React from 'react'

export const FileIcon = (props) => {
  const { className, ...rest } = props
  return (
    <svg className={className} {...rest} viewBox='0 0 30 30'>
      <path d='M22,8v12c0,3.866-3.134,7-7,7s-7-3.134-7-7V8c0-2.762,2.238-5,5-5s5,2.238,5,5v12c0,1.657-1.343,3-3,3s-3-1.343-3-3V8h-2v12c0,2.762,2.238,5,5,5s5-2.238,5-5V8c0-3.866-3.134-7-7-7S6,4.134,6,8v12c0,4.971,4.029,9,9,9s9-4.029,9-9V8H22z'></path>
    </svg>
  )
}

import * as React from 'react'

import { cs } from '../utils'

export const ClearIcon = (props) => {
  const { className, ...rest } = props
  return (
    <svg className={cs('notion-icon', className)} {...rest} viewBox='0 0 30 30'>
      <path d='M15,0C6.716,0,0,6.716,0,15s6.716,15,15,15s15-6.716,15-15S23.284,0,15,0z M22,20.6L20.6,22L15,16.4L9.4,22L8,20.6l5.6-5.6 L8,9.4L9.4,8l5.6,5.6L20.6,8L22,9.4L16.4,15L22,20.6z'></path>
    </svg>
  )
}

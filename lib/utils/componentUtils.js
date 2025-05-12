import { memo } from 'react'

/**
 * 组件持久化
 */
export const memorize = Component => {
  const MemoizedComponent = props => {
    return <Component {...props} />
  }
  return memo(MemoizedComponent)
}

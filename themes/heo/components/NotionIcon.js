import LazyImage from '@/components/LazyImage'

/**
 * notion的图标icon
 * 可能是emoji 可能是 svg 也可能是 图片
 * @returns
 */
const NotionIcon = ({ icon, className = 'w-8 h-8 my-auto inline mr-1' }) => {
  if (!icon) {
    return <></>
  }

  if (icon.startsWith('http') || icon.startsWith('data:')) {
    // 这里优先使用传入的 className
    return <LazyImage src={icon} className={className} />
  }

  // 对于 emoji 或 svg，设置默认 className，也可以传递不同的样式
  return <span className={`inline-block ${className}`}>{icon}</span>
}

export default NotionIcon

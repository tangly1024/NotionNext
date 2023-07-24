import LazyImage from './LazyImage'

/**
 * notion的图标icon
 * 可能是emoji 可能是 svg 也可能是 图片
 * @returns
 */
const NotionIcon = ({ icon }) => {
  if (!icon) {
    return <></>
  }

  if (icon.startsWith('http') || icon.startsWith('data:')) {
    return <LazyImage src={icon} className='w-8 h-8 my-auto inline mr-1'/>
  }

  return <span className='mr-1'>{icon}</span>
}

export default NotionIcon

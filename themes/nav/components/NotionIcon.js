import LazyImage from '@/components/LazyImage'

/**
 * notion的图标icon
 * 可能是emoji 可能是 svg 也可能是 图片
 * @returns
 */
const NotionIcon = ({ icon }) => {
  let imgSize = 8
  let fontSize = ''
  if (!icon) {
    return <></>
  }
  fontSize = (Math.round(imgSize / 2) - 1) > 0 ? (Math.round(imgSize / 2) - 1) : ''
  if (icon.startsWith('http') || icon.startsWith('data:')) {
    return <LazyImage src={icon} className={`w-10 h-10 inline`}/>
  }

  return <span className={`mr-1 text-4xl`}>{icon}</span>
}

export default NotionIcon

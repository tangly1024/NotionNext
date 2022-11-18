/**
 * notion的图标icon
 * 可能是emoji 可能是 svg 也可能是 图片
 * @returns
 */
const NotionIcon = ({ icon }) => {
  if (!icon) {
    return <></>
  }

  if (icon.startsWith('http')) {
    //   return <Image src={icon} width={30} height={30}/>
    //   eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} className='w-8 float-left mr-1'/>
  }

  return <span className='mr-1'>{icon}</span>
}

export default NotionIcon

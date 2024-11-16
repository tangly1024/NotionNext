import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
/**
 * 封面图
 * @param {*} props
 * @returns
 */
export const HomeBackgroundImage = props => {
  const { siteInfo } = useGlobal()
  const background = siteConfig('MOVIE_HOME_BACKGROUND')
  if (!background) {
    return null
  }
  return (
    <LazyImage
      className='-mt-20 w-screen h-screen pointer-events-none select-none object-cover'
      src={siteInfo?.pageCover}
    />
  )
}

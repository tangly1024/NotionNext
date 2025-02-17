import { useGlobal } from '@/lib/global'
import LazyImage from '@/components/LazyImage'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import config from '@/themes/heo/config'

const Transition = dynamic(() =>
  import('@headlessui/react').then(mod => mod.Transition)
)
const LatestPostsGroup = dynamic(() => import('./components/LatestPostsGroup'))
/**
 * 404
 * @param {*} props
 * @returns
 */
export const Layout404 = props => {
  // const { meta, siteInfo } = props
  const { onLoading, fullWidth } = useGlobal()
  const HEO_404_TITLE = siteConfig(
    'HEO_404_TITLE',
    config.HEO_404_TITLE,
    props.config
  )
  const HEO_404_BACK = siteConfig(
    'HEO_404_BACK',
    config.HEO_404_BACK,
    props.config
  )
  return (
    <>
      {/* 主区块 */}
      <main
        id='wrapper-outer'
        className={`flex-grow ${fullWidth ? '' : 'max-w-4xl'} w-screen mx-auto px-5`}>
        <div id='error-wrapper' className={'w-full mx-auto justify-center'}>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-in-out duration-700 transform order-first'
            enterFrom='opacity-0 translate-y-16'
            enterTo='opacity-100'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-16'
            unmount={false}>
            {/* 404卡牌 */}
            <div className='error-content flex flex-col md:flex-row w-full mt-12 h-[30rem] md:h-96 justify-center items-center bg-white dark:bg-[#1B1C20] border dark:border-gray-800 rounded-3xl'>
              {/* 左侧动图 */}
              <LazyImage
                className='error-img h-60 md:h-full p-4'
                src='/404.gif'
              />
              {/* 右侧文字 */}
              <div className='error-info flex-1 flex flex-col justify-center items-center space-y-4'>
                <h1 className='error-title font-extrabold md:text-9xl text-7xl dark:text-white'>
                  404
                </h1>
                <div className='dark:text-white'>{HEO_404_TITLE}</div>
                <Link href='/'>
                  <button className='bg-blue-500 py-2 px-4 text-white shadow rounded-lg hover:bg-blue-600 hover:shadow-md duration-200 transition-all'>
                    {HEO_404_BACK}
                  </button>
                </Link>
              </div>
            </div>

            {/* 404页面底部显示最新文章 */}
            <div className='mt-12'>
              <LatestPostsGroup {...props} />
            </div>
          </Transition>
        </div>
      </main>
    </>
  )
}

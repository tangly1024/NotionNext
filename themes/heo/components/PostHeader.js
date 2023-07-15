import Link from 'next/link'
import TagItemMini from './TagItemMini'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import NotionIcon from '@/components/NotionIcon'
import WavesArea from './WavesArea'

export default function PostHeader({ post, siteInfo }) {
  const { locale } = useGlobal()

  if (!post) {
    return <></>
  }
  // 文章头图
  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover

  return (
        <div id="post-bg" className="w-full h-[30rem] relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat z-10">

            <div id='article-header-cover' style={{ backdropFilter: 'blur(15px)' }} className="bg-[#0060e0] absolute top-0 w-full h-full py-10 flex justify-center items-center ">

                <div id='post-cover-wrapper' style={{ filter: 'blur(15px)' }} className='opacity-50 rotate-12 translate-x-12 -mr-60'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img id='post-cover' style={{ boxShadow: 'box-shadow:110px -130px 300px 60px #4d240c inset' }} className='w-full h-full object-cover opacity-80 min-w-[50vw] min-h-[20rem]' src={headerImage}/>
                </div>

                <div id='post-info' className='absolute z-10 flex flex-col w-full max-w-[86rem] px-5'>
                    <div className='mb-3 flex justify-start'>
                        {post.category && <>
                            <Link href={`/category/${post.category}`} passHref legacyBehavior>
                                <div className="cursor-pointer px-2 py-1 mb-2 border rounded-sm dark:border-white text-sm font-medium hover:underline duration-200 shadow-text-md text-white">
                                    {post.category}
                                </div>
                            </Link>
                        </>}
                    </div>

                    {/* 文章Title */}
                    <div className="max-w-5xl font-bold xs:text-4xl sm:text-4xl md:text-4xl md:leading-snug shadow-text-md flex justify-start text-white">
                        <span><NotionIcon icon={post.pageIcon} className='text-4xl mx-1' /></span>{post.title}
                    </div>

                    <section className="flex-wrap shadow-text-md flex text-sm justify-start mt-4 text-white dark:text-gray-400 font-light leading-8">

                        <div className='flex justify-center dark:text-gray-200 text-opacity-70'>
                            {post?.type !== 'Page' && (
                                <>
                                    <Link
                                        href={`/archive#${post?.publishTime?.substr(0, 7)}`}
                                        passHref
                                        className="pl-1 mr-2 cursor-pointer hover:underline">

                                        {locale.COMMON.POST_TIME}:{post?.publishTime}

                                    </Link>
                                </>
                            )}
                            <div className="pl-1 mr-2">
                                {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedTime}
                            </div>
                        </div>

                        {BLOG.ANALYTICS_BUSUANZI_ENABLE && <div className="busuanzi_container_page_pv font-light mr-2">
                            <span className="mr-2 busuanzi_value_page_pv" />
                            {locale.COMMON.VIEWS}
                        </div>}
                    </section>

                    <div className='mt-4 mb-1'>
                        {post.tagItems && (
                            <div className="flex justify-center flex-nowrap overflow-x-auto">
                                {post.tagItems.map(tag => (
                                    <TagItemMini key={tag.name} tag={tag} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <WavesArea />

            </div>
        </div>
  )
}

import Router from 'next/router'
import Image from 'next/image'
import BLOG from '@/blog.config'
import Card from './Card'
import MenuButtonGroup from './MenuButtonGroup'
import SearchInput from './SearchInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartArea, faTh } from '@fortawesome/free-solid-svg-icons'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import SocialButton from './SocialButton'

export default function SideRight (props) {
  const { postCount, currentCategory, categories, latestPosts, tags, currentTag } = props
  return <div id='left' className='w-96 mx-4 space-y-4 hidden lg:block'>
    <Card>
      <div className='justify-center items-center flex hover:rotate-45 py-6 hover:scale-105 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/') }}>
        <Image
          alt={BLOG.AUTHOR}
          width={120}
          height={120}
          loading='lazy'
          src='/avatar.jpg'
          className='rounded-full'
        />
      </div>
      <div className='text-center text-xl pb-4'>{BLOG.TITLE}</div>
      <SocialButton/>
    </Card>
    <Card>
      <MenuButtonGroup/>
      <SearchInput/>
    </Card>
    <Card>
      <div className='text-xs font-light ml-2 mb-3 font-sans'>
        <FontAwesomeIcon icon={faChartArea}/> 统计
      </div>
        <div className='text-xs font-sans font-light justify-center mx-6'>
          <div className='inline'>
             <div className='flex justify-between'><div>文章数:</div> <div>{postCount}</div></div>
          </div>
          <div className="hidden busuanzi_container_page_pv ml-2">
            <div className='flex justify-between'><div>访问量:</div><div className="busuanzi_value_page_pv"/></div>
          </div>
          <div className="hidden busuanzi_container_site_uv ml-2">
            <div className='flex justify-between'><div>访客数:</div><div className="busuanzi_value_site_uv"/></div>
          </div>
        </div>
    </Card>
    <Card>
      <div className='text-xs font-light ml-2 mb-1 font-sans'>
        <FontAwesomeIcon icon={faTh}/> 分类
      </div>
      <CategoryGroup currentCategory={currentCategory} categories={categories}/>
    </Card>
    <Card>
      <TagGroups tags={tags} currentTag={currentTag}/>
    </Card>
    <Card>
      <LatestPostsGroup posts={latestPosts}/>
    </Card>
  </div>
}

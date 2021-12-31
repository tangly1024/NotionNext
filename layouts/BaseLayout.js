import CommonHead from '@/components/CommonHead'
import FloatDarkModeButton from '@/components/FloatDarkModeButton'
import Footer from '@/components/Footer'
import JumpToBottomButton from '@/components/JumpToBottomButton'
import JumpToTopButton from '@/components/JumpToTopButton'
import LoadingCover from '@/components/LoadingCover'
import SideAreaLeft from '@/components/SideAreaLeft'
import SideAreaRight from '@/components/SideAreaRight'
import TopNav from '@/components/TopNav'
import { useGlobal } from '@/lib/global'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param fullWidth
 * @param tags
 * @param meta
 * @param post
 * @param totalPosts
 * @param currentSearch
 * @param currentCategory
 * @param currentTag
 * @param categories
 * @param customMeta
 * @returns {JSX.Element}
 * @constructor
 */
const BaseLayout = ({
  children,
  layout,
  fullWidth,
  headerSlot,
  tags,
  meta,
  post,
  totalPosts,
  currentSearch,
  currentCategory,
  currentTag,
  categories,
  ...customMeta
}) => {
  const { onLoading } = useGlobal()
  const targetRef = useRef(null)

  return (<>

      <CommonHead meta={meta} />

      <TopNav tags={tags} post={post} posts={totalPosts} currentSearch={currentSearch} categories={categories} currentCategory={currentCategory} />

      <>{headerSlot}</>

      <main id='wrapper' className='flex justify-center flex-1 mx-auto md:pt-14 pb-12'>
          <aside id='left' className='hidden lg:block flex-col w-60 mr-4'>
            <SideAreaLeft targetRef={targetRef} post={post} posts={totalPosts} tags={tags} currentSearch={currentSearch} currentTag={currentTag} categories={categories} currentCategory={currentCategory}/>
          </aside>
          <section id='center' className='flex-grow mt-14 md:mt-0 max-w-4xl min-h-screen' ref={targetRef}>
            {onLoading
              ? <LoadingCover/>
              : <>
                {children}
              </>
            }
          </section>
          <aside id='right' className='hidden 2xl:block flex-col w-60 ml-4'>
            <SideAreaRight targetRef={targetRef} post={post} posts={totalPosts} tags={tags} currentSearch={currentSearch} currentTag={currentTag} categories={categories} currentCategory={currentCategory}/>
          </aside>
      </main>

      <Footer title={meta.title}/>
      <JumpToTopButton targetRef={targetRef} showPercent={false} />
      <JumpToBottomButton targetRef={targetRef} showPercent={false}/>
      <FloatDarkModeButton/>
      </>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node
}

export default BaseLayout

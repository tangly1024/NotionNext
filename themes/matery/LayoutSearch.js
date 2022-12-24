import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import SearchInput from './components/SearchInput'
import { useGlobal } from '@/lib/global'
import Mark from 'mark.js'
import TagItemMini from './components/TagItemMini'
import Card from './components/Card'
import Link from 'next/link'

export const LayoutSearch = props => {
  const { keyword, tags, categories } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s
  const cRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      // 自动聚焦到搜索框
      cRef?.current?.focus()
      if (currentSearch) {
        const targets = document.getElementsByClassName('replace')
        for (const container of targets) {
          if (container && container.innerHTML) {
            const re = new RegExp(currentSearch, 'gim')
            const instance = new Mark(container)
            instance.markRegExp(re, {
              element: 'span',
              className: 'text-red-500 border-b border-dashed'
            })
          }
        }
      }
    }, 100)
  })
  return (
        <LayoutBase {...props} currentSearch={currentSearch}>
            {!currentSearch && <>
                <div className="my-6 px-2">
                    <SearchInput cRef={cRef} {...props} />
                    {/* 分类 */}
                    <Card className="w-full mt-4">
                        <div className="dark:text-gray-200 mb-5 mx-3">
                            <i className="mr-4 fas fa-th" />
                            {locale.COMMON.CATEGORY}:
                        </div>
                        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
                            {categories?.map(category => {
                              return (
                                    <Link
                                        key={category.name}
                                        href={`/category/${category.name}`}
                                        passHref
                                    >
                                        <div
                                            className={
                                                ' duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-indigo-400 hover:text-white'
                                            }
                                        >
                                            <i className="mr-4 fas fa-folder" />
                                            {category.name}({category.count})
                                        </div>
                                    </Link>
                              )
                            })}
                        </div>
                    </Card>
                    {/* 标签 */}
                    <Card className="w-full mt-4">
                        <div className="dark:text-gray-200 mb-5 ml-4">
                            <i className="mr-4 fas fa-tag" />
                            {locale.COMMON.TAGS}:
                        </div>
                        <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
                            {tags?.map(tag => {
                              return (
                                    <div key={tag.name} className="p-2">
                                        <TagItemMini key={tag.name} tag={tag} />
                                    </div>
                              )
                            })}
                        </div>
                    </Card>
                </div>
            </>}

            {currentSearch && <>
                <div id="container">
                    {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
                </div>
            </>}

        </LayoutBase>
  )
}

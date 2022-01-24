import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import CONFIG_NEXT from '../NEXT/config_next'
import ArticleDetail from './components/ArticleDetail'
import Card from './components/Card'
import LayoutBase from './LayoutBase'

export const LayoutSlug = props => {
  const { post } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  const { locale } = useGlobal()
  const date = formatDate(
    post?.date?.start_date || post.createdTime,
    locale.LOCALE
  )

  const headerSlot = (
    <div className="w-full h-96 relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url("/${CONFIG_NEXT.HOME_BANNER_IMAGE}")` }}>

      <header className="animate__slideInDown animate__animated bg-black bg-opacity-50 absolute top-0 w-full h-96 py-10 flex justify-center items-center font-sans">
        <div>
          {/* 文章Title */}
          <div className="font-bold text-3xl shadow-text flex justify-center text-white dark:text-white font-sans">
            {post.title}
          </div>

          <section className="flex-wrap shadow-text flex justify-center mt-2 text-white dark:text-gray-400 font-light leading-8">
            <div>
              <Link href={`/category/${post.category}`} passHref>
                <a className="cursor-pointer text-md mr-2 dark:hover:text-white border-b dark:border-gray-500 border-dashed">
                  <FontAwesomeIcon icon={faFolderOpen} className="mr-1" />
                  {post.category}
                </a>
              </Link>
              <span className="mr-2">|</span>

              {post.type[0] !== 'Page' && (<>
                  <Link
                    href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                    passHref
                  >
                    <a className="pl-1 mr-2 cursor-pointer hover:underline border-b dark:border-gray-500 border-dashed">
                      {date}
                    </a>
                  </Link>
                </>)}

              <div className="hidden busuanzi_container_page_pv font-light mr-2">
                <span className="mr-2">|</span>
                <span className="mr-2 busuanzi_value_page_pv" />次访问
              </div>
            </div>
          </section>
        </div>
      </header>
    </div>
  )

  return (
    <LayoutBase headerSlot={headerSlot} {...props} meta={meta}>
      <Card className="w-full">
        <ArticleDetail {...props} />
      </Card>
    </LayoutBase>
  )
}

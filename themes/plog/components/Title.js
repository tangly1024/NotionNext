import BLOG from '@/blog.config'

/**
 * 标题栏
 * @param {*} props
 * @returns
 */
export const Title = (props) => {
  const { siteInfo, post } = props
  const title = post?.title || siteInfo?.description
  const description = post?.description || BLOG.AUTHOR

  return <div className="text-center px-6 py-12 mb-6 bg-gray-100 dark:bg-hexo-black-gray dark:border-hexo-black-gray border-b">
        <h1 className=" text-xl md:text-4xl pb-4">{title}</h1>
        <p className="leading-loose text-gray-dark">
            {description}
        </p>
    </div>
}

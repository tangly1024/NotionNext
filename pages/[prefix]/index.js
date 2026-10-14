import BLOG from '@/blog.config'
import useNotification from '@/components/Notification'
import TechGrow from '@/components/TechGrow'
import { siteConfig } from '@/lib/config'
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import { useGlobal } from '@/lib/global'
import useProtectedPost from '@/hooks/useProtectedPost'
import ArticleLock from '@/components/ArticleLock'
import { checkSlugHasNoSlash } from '@/lib/utils/post'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { getStaticPathsBase } from '@/lib/build/staticPaths'
import { isExport } from '@/lib/utils/buildMode'

const isStaticExport = process.env.EXPORT === 'true'

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const router = useRouter()
  const { locale } = useGlobal()
  const access = useProtectedPost(props.post, router, locale, props.postUnlockUnavailable)
  const { showNotification, Notification } = useNotification()
  const validPassword = async password => {
    const valid = await access.validPassword(password)
    if (valid) showNotification(locale.COMMON.ARTICLE_UNLOCK_TIPS)
    return valid
  }
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      {access.unlockError && <p role='alert' className='p-4 text-center text-red-600'>{access.unlockError}</p>}
      {props.postUnlockUnavailable
        ? <ArticleLock unavailable post={props.post} />
        : <DynamicLayout theme={theme} layoutName='LayoutSlug' {...props} {...access} validPassword={validPassword} />}
      {props.post?.password && !access.lock && <Notification />}
      <TechGrow lock={access.lock} />
    </>
  )
}

Slug.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    password: PropTypes.string,
    content: PropTypes.array,
    toc: PropTypes.array,
    blockMap: PropTypes.shape({
      block: PropTypes.object
    })
  }),
  NOTION_CONFIG: PropTypes.object
}

export async function getStaticPaths() {
  return getStaticPathsBase({
    from: 'slug-paths',
    filterFn: row => checkSlugHasNoSlash(row),
    mapPageToParams: row => ({ params: { prefix: row.slug } })
  })
}

export async function getStaticProps({ params: { prefix }, locale, revalidateReason }) {
  const props = await resolvePostProps({
    prefix,
    locale,
    revalidateReason,
  })

  return {
    props,
    revalidate: isStaticExport
      ? undefined
      : siteConfig(
        'NEXT_REVALIDATE_SECOND',
        BLOG.NEXT_REVALIDATE_SECOND,
        props.NOTION_CONFIG
      ),
    notFound: !props.post
  }
}

export default Slug

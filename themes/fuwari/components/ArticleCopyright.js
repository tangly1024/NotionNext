import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { resolveArticleCopyrightText } from '@/lib/utils/articleCopyright'
import {
  stripTransientQueryParamsFromAsPath,
  stripTransientQueryParamsFromUrl
} from '@/lib/utils/stripTransientUrlParams'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

const ArticleCopyright = ({ post }) => {
  const router = useRouter()
  const { locale } = useGlobal()
  const [fullUrl, setFullUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(stripTransientQueryParamsFromUrl(window.location.href))
      return
    }
    const base = (siteConfig('LINK') || '').replace(/\/$/, '')
    const raw = post?.href || router?.asPath || `/${post?.slug || ''}`
    const path =
      raw.startsWith('http://') || raw.startsWith('https://')
        ? stripTransientQueryParamsFromUrl(raw)
        : stripTransientQueryParamsFromAsPath(raw)
    setFullUrl(`${base}${path}`)
  }, [post?.href, post?.slug, router?.asPath])

  const licenseText = resolveArticleCopyrightText({
    post,
    locale,
    mode: siteConfig('FUWARI_ARTICLE_COPYRIGHT', true, CONFIG)
  })

  const handleCopy = async () => {
    if (!fullUrl || typeof navigator === 'undefined' || !navigator.clipboard)
      return
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  if (!post || !licenseText) return null

  const authorName = (siteConfig('AUTHOR') || '').trim() || siteConfig('TITLE')
  const profileHref = siteConfig('FUWARI_PROFILE_PATH', '/about', CONFIG)

  return (
    <section className='mt-6 fuwari-card p-4 text-sm text-[var(--fuwari-muted)] leading-7'>
      <div>
        <span className='font-semibold mr-2'>
          {locale?.COMMON?.AUTHOR || 'Author'}:
        </span>
        <SmartLink href={profileHref} className='fuwari-link'>
          {authorName}
        </SmartLink>
      </div>
      <div className='mt-1'>
        <span className='font-semibold mr-2'>
          {locale?.COMMON?.URL || 'URL'}:
        </span>
        <a href={fullUrl} className='break-all hover:underline'>
          {fullUrl || post?.href || post?.slug}
        </a>
      </div>
      <div className='mt-1'>
        <span className='font-semibold mr-2'>
          {locale?.COMMON?.COPYRIGHT || 'Copyright'}:
        </span>
        {licenseText}
      </div>
      <div className='mt-3'>
        <button type='button' onClick={() => { void handleCopy() }} className='fuwari-copy-btn'>
          <i className='far fa-copy mr-1' />
          {copied
            ? locale?.COMMON?.COPIED || 'Copied'
            : locale?.COMMON?.COPY_URL || 'Copy URL'}
        </button>
      </div>
    </section>
  )
}

export default ArticleCopyright

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const ArticleCopyright = ({ post }) => {
  const router = useRouter()
  const { locale } = useGlobal()
  const [fullUrl, setFullUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(window.location.href)
      return
    }
    const base = (siteConfig('LINK') || '').replace(/\/$/, '')
    const path = (post?.href || router?.asPath || `/${post?.slug || ''}`).replace(/^\//, '/')
    setFullUrl(`${base}${path}`)
  }, [post?.href, post?.slug, router?.asPath])

  const licenseText = useMemo(
    () => locale?.COMMON?.COPYRIGHT_NOTICE || 'CC BY-NC-SA 4.0（除非特别声明）',
    [locale]
  )

  const handleCopy = async () => {
    if (!fullUrl || typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  if (!siteConfig('FUWARI_ARTICLE_COPYRIGHT', true, CONFIG) || !post) return null

  return (
    <section className='mt-6 fuwari-card p-4 text-sm text-[var(--fuwari-muted)] leading-7'>
      <div>
        <span className='font-semibold mr-2'>{locale?.COMMON?.AUTHOR || '作者'}:</span>
        <SmartLink href='/about' className='fuwari-link'>
          {siteConfig('AUTHOR') || siteConfig('TITLE')}
        </SmartLink>
      </div>
      <div className='mt-1'>
        <span className='font-semibold mr-2'>{locale?.COMMON?.URL || '永久链接'}:</span>
        <a href={fullUrl} className='break-all hover:underline'>{fullUrl || post?.href || post?.slug}</a>
      </div>
      <div className='mt-1'>
        <span className='font-semibold mr-2'>{locale?.COMMON?.COPYRIGHT || '版权'}:</span>
        {licenseText}
      </div>
      <div className='mt-3'>
        <button type='button' onClick={handleCopy} className='fuwari-copy-btn'>
          <i className='far fa-copy mr-1' />
          {copied ? (locale?.COMMON?.COPIED || '已复制') : (locale?.COMMON?.COPY_URL || '复制链接')}
        </button>
      </div>
    </section>
  )
}

export default ArticleCopyright


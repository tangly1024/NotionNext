import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useState } from 'react'

export default function Catalog({ post }) {
  const { locale } = useGlobal()
  const [active, setActive] = useState(null)

  useEffect(() => {
    const spy = throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let current = null
      for (const section of sections) {
        if (section.getBoundingClientRect().top < 180) {
          current = section.getAttribute('data-id')
        } else {
          break
        }
      }
      setActive(current)
    }, 160)
    window.addEventListener('scroll', spy, { passive: true })
    spy()
    return () => {
      window.removeEventListener('scroll', spy)
      spy.cancel()
    }
  }, [post])

  if (!post?.toc?.length) return null

  return (
    <aside className='editorial-toc'>
      <div className='editorial-toc-title'>
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>
      <nav>
        {post.toc.map(item => {
          const id = uuidToId(item.id)
          return (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : ''}
              style={{ paddingLeft: `${item.indentLevel * 12}px` }}>
              {item.text}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}

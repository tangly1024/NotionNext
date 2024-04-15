import * as React from 'react'

import { Block } from 'notion-types'

import { useNotionContext } from '../context'
import SvgTypeGitHub from '../icons/type-github'
import { cs, formatNotionDateTime } from '../utils'
import { MentionPreviewCard } from './mention-preview-card'

// External Object Instance
export const EOI: React.FC<{
  block: Block
  inline?: boolean
  className?: string
}> = ({ block, inline, className }) => {
  const { components } = useNotionContext()
  const { original_url, attributes, domain } = block?.format || {}
  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr) => attr.id === 'title')?.values[0]
  let owner = attributes.find((attr) => attr.id === 'owner')?.values[0]
  const lastUpdatedAt = attributes.find((attr) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null
  let externalImage: React.ReactNode

  switch (domain) {
    case 'github.com':
      externalImage = <SvgTypeGitHub />
      if (owner) {
        const parts = owner.split('/')
        owner = parts[parts.length - 1]
      }
      break

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }

  return (
    <components.Link
      target='_blank'
      rel='noopener noreferrer'
      href={original_url}
      className={cs(
        'notion-external',
        inline ? 'notion-external-mention' : 'notion-external-block notion-row',
        className
      )}
    >
      {externalImage && (
        <div className='notion-external-image'>{externalImage}</div>
      )}

      <div className='notion-external-description'>
        <div className='notion-external-title'>{title}</div>

        {(owner || lastUpdated) && (
          <MentionPreviewCard
            title={title}
            owner={owner}
            lastUpdated={lastUpdated}
            domain={domain}
            externalImage={externalImage}
          />
        )}
      </div>
    </components.Link>
  )
}

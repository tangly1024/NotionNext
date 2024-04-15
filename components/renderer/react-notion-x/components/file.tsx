import * as React from 'react'

import { FileBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { FileIcon } from '../icons/file-icon'
import { cs } from '../utils'
import { Text } from './text'

export const File: React.FC<{
  block: FileBlock
  className?: string
}> = ({ block, className }) => {
  const { components, recordMap } = useNotionContext()
  const source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0]

  return (
    <div className={cs('notion-file', className)}>
      <components.Link
        className='notion-file-link'
        href={source}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FileIcon className='notion-file-icon' />

        <div className='notion-file-info'>
          <div className='notion-file-title'>
            <Text value={block.properties?.title || [['File']]} block={block} />
          </div>

          {block.properties?.size && (
            <div className='notion-file-size'>
              <Text value={block.properties.size} block={block} />
            </div>
          )}
        </div>
      </components.Link>
    </div>
  )
}

import * as React from 'react'

import { GoogleDriveBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { cs } from '../utils'
import { GracefulImage } from './graceful-image'

export const GoogleDrive: React.FC<{
  block: GoogleDriveBlock
  className?: string
}> = ({ block, className }) => {
  const { components, mapImageUrl } = useNotionContext()
  const properties = block.format?.drive_properties
  if (!properties) return null
  let domain

  try {
    const url = new URL(properties.url)
    domain = url.hostname
  } catch (err) {
    // ignore invalid urls for robustness
  }

  return (
    <div className={cs('notion-google-drive', className)}>
      <components.Link
        className='notion-google-drive-link'
        href={properties.url}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div className='notion-google-drive-preview'>
          <GracefulImage
            src={mapImageUrl(properties.thumbnail, block)}
            alt={properties.title || 'Google Drive Document'}
            loading='lazy'
          />
        </div>

        <div className='notion-google-drive-body'>
          {properties.title && (
            <div className='notion-google-drive-body-title'>
              {properties.title}
            </div>
          )}

          {/* TODO: re-add last modified time with alternative to timeago.js */}
          {/* {properties.modified_time && (
            <div className='notion-google-drive-body-modified-time'>
              Last modified{' '}
              {properties.user_name ? `by ${properties.user_name} ` : ''}
              {timeago(properties.modified_time)}
            </div>
          )} */}

          {properties.icon && domain && (
            <div className='notion-google-drive-body-source'>
              {properties.icon && (
                <div
                  className='notion-google-drive-body-source-icon'
                  style={{
                    backgroundImage: `url(${properties.icon})`
                  }}
                />
              )}

              {domain && (
                <div className='notion-google-drive-body-source-domain'>
                  {domain}
                </div>
              )}
            </div>
          )}
        </div>
      </components.Link>
    </div>
  )
}

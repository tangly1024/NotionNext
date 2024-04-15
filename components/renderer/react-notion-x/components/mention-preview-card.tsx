import React from 'react'

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const MentionPreviewCard: React.FC<{
  owner?: string
  lastUpdated?: string
  title: string
  domain: string
  externalImage?: React.ReactNode
}> = ({ owner, lastUpdated, externalImage, title, domain }) => {
  return (
    <div className='notion-external-subtitle'>
      {externalImage && (
        <div className='notion-preview-card-domain-warp'>
          <div className='notion-preview-card-logo'>{externalImage}</div>
          <div className='notion-preview-card-domain'>
            {capitalizeFirstLetter(domain.split('.')[0])}
          </div>
        </div>
      )}
      <div className='notion-preview-card-title'>{title}</div>
      {owner && (
        <div className='notion-external-subtitle-item'>
          <div className='notion-external-subtitle-item-name'>Owner</div>
          <span className='notion-external-subtitle-item-desc'>{owner}</span>
        </div>
      )}
      {lastUpdated && (
        <div className='notion-external-subtitle-item'>
          <div className='notion-external-subtitle-item-name'>Updated</div>
          <span className='notion-external-subtitle-item-desc'>
            {lastUpdated}
          </span>
        </div>
      )}
      {domain === 'github.com' && (
        <div className='notion-preview-card-github-shields'>
          <img
            src={`https://img.shields.io/github/stars/${owner}/${title}?logo=github`}
            alt=''
          />
          <img
            src={`https://img.shields.io/github/last-commit/${owner}/${title}`}
            alt=''
          />
        </div>
      )}
    </div>
  )
}

import * as React from 'react'

import { CollectionViewType } from 'notion-types'

import CollectionViewBoardIcon from './collection-view-board'
import CollectionViewCalendarIcon from './collection-view-calendar'
import CollectionViewGalleryIcon from './collection-view-gallery'
import CollectionViewListIcon from './collection-view-list'
import CollectionViewTableIcon from './collection-view-table'

interface CollectionViewIconProps {
  className?: string
  type: CollectionViewType
}

const iconMap = {
  table: CollectionViewTableIcon,
  board: CollectionViewBoardIcon,
  gallery: CollectionViewGalleryIcon,
  list: CollectionViewListIcon,
  calendar: CollectionViewCalendarIcon
}

export const CollectionViewIcon: React.FC<CollectionViewIconProps> = ({
  type,
  ...rest
}) => {
  const icon = iconMap[type] as any
  if (!icon) {
    return null
  }

  return icon(rest)
}

import * as React from 'react'

import { CollectionPropertySchema } from 'notion-types'

import { PropertyIcon } from '../icons/property-icon'

export const CollectionColumnTitle: React.FC<{
  schema: CollectionPropertySchema
}> = ({ schema }) => {
  return (
    <div className='notion-collection-column-title'>
      <PropertyIcon
        className='notion-collection-column-title-icon'
        type={schema.type}
      />

      <div className='notion-collection-column-title-body'>{schema.name}</div>
    </div>
  )
}

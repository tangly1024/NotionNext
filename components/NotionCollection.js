import { galleryVisibilityClassName } from '@/lib/notion/galleryVisibilityClassName'
import { Collection } from 'react-notion-x/build/third-party/collection'

export const GALLERY_VISIBILITY_WRAPPER_CLASS =
  'notion-gallery-visibility-wrapper'

export default function NotionCollection(props) {
  const collectionView = props.block?.view_ids
    ?.map(viewId => {
      const record = props.ctx?.recordMap?.collection_view?.[viewId]
      return record?.value?.value || record?.value || record
    })
    .find(view => view?.type === 'gallery')
  const className = galleryVisibilityClassName(collectionView)

  if (!className) return <Collection {...props} />

  return (
    <div className={`${GALLERY_VISIBILITY_WRAPPER_CLASS} ${className}`}>
      <Collection {...props} />
    </div>
  )
}

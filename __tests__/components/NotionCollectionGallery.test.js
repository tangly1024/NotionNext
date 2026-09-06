/** @jest-environment node */

import NotionCollection from '@/components/NotionCollection'
import { galleryVisibilityClassName } from '@/lib/notion/galleryVisibilityClassName'
import { execFileSync } from 'child_process'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

jest.mock('react-notion-x/build/third-party/collection', () => {
  const React = require('react')

  return {
    Collection: props =>
      React.createElement('div', {
        'data-collection-class-name': props.className || ''
      })
  }
})

const galleryView = format => ({ id: 'gallery_view', type: 'gallery', format })

const galleryRecordMap = {
  block: {
    collection_view: {
      value: {
        id: 'collection_view',
        type: 'collection_view',
        collection_id: 'collection',
        view_ids: ['gallery_view']
      }
    }
  },
  collection: {},
  collection_view: {
    gallery_view: {
      value: galleryView({
        gallery_properties: [{ property: 'title', visible: false }]
      })
    }
  },
  collection_query: {},
  signed_urls: {}
}

const nestedGalleryRecordMap = format => ({
  ...galleryRecordMap,
  collection_view: {
    gallery_view: {
      spaceId: 'space',
      value: {
        role: 'reader',
        value: galleryView(format)
      }
    }
  }
})

const nestedGalleryAfterTableRecordMap = format => {
  const recordMap = nestedGalleryRecordMap(format)
  return {
    ...recordMap,
    block: {
      collection_view: {
        value: {
          ...recordMap.block.collection_view.value,
          view_ids: ['table_view', 'gallery_view']
        }
      }
    },
    collection_view: {
      table_view: {
        value: {
          role: 'reader',
          value: { id: 'table_view', type: 'table', format: {} }
        }
      },
      ...recordMap.collection_view
    }
  }
}

const renderCollectionPropsScript = `
  const React = (await import('react')).default
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { NotionRenderer } = await import('react-notion-x')
  const recordMap = ${JSON.stringify(galleryRecordMap)}
  const ProbeCollection = props => {
    const viewId = props.block?.view_ids?.[0]
    const collectionView = props.ctx?.recordMap?.collection_view?.[viewId]?.value
    return React.createElement('output', {
      'data-prop-keys': Object.keys(props).sort().join(','),
      'data-context-view-type': collectionView?.type || 'missing'
    })
  }
  process.stdout.write(
    renderToStaticMarkup(
      React.createElement(NotionRenderer, {
        recordMap,
        components: { Collection: ProbeCollection }
      })
    )
  )
`

describe('Notion Gallery visibility settings', () => {
  it('receives block and renderer context instead of a collectionView prop', () => {
    const markup = execFileSync(
      process.execPath,
      ['--input-type=module', '-e', renderCollectionPropsScript],
      { encoding: 'utf8' }
    )

    expect(markup).toContain('data-prop-keys="block,ctx"')
    expect(markup).toContain('data-context-view-type="gallery"')
  })

  it('reads the Gallery view from the Collection override renderer context', () => {
    const markup = renderToStaticMarkup(
      React.createElement(NotionCollection, {
        block: galleryRecordMap.block.collection_view.value,
        ctx: { recordMap: galleryRecordMap }
      })
    )

    expect(markup).toContain(
      'class="notion-gallery-hide-page-icons notion-gallery-hide-titles"'
    )
  })

  it('unwraps the nested collection-view record returned by Notion', () => {
    const recordMap = nestedGalleryRecordMap({
      gallery_properties: [{ property: 'title', visible: false }]
    })
    const markup = renderToStaticMarkup(
      React.createElement(NotionCollection, {
        block: recordMap.block.collection_view.value,
        ctx: { recordMap }
      })
    )

    expect(markup).toContain(
      'class="notion-gallery-hide-page-icons notion-gallery-hide-titles"'
    )
  })

  it('keeps a visible title from the nested collection-view record', () => {
    const recordMap = nestedGalleryRecordMap({
      gallery_properties: [{ property: 'title', visible: true }]
    })
    const markup = renderToStaticMarkup(
      React.createElement(NotionCollection, {
        block: recordMap.block.collection_view.value,
        ctx: { recordMap }
      })
    )

    expect(markup).toContain('class="notion-gallery-hide-page-icons"')
    expect(markup).not.toContain('notion-gallery-hide-titles')
  })

  it('uses Gallery settings when Gallery is not the first collection view', () => {
    const recordMap = nestedGalleryAfterTableRecordMap({
      gallery_properties: [{ property: 'title', visible: true }]
    })
    const markup = renderToStaticMarkup(
      React.createElement(NotionCollection, {
        block: recordMap.block.collection_view.value,
        ctx: { recordMap }
      })
    )

    expect(markup).toContain('class="notion-gallery-hide-page-icons"')
  })

  it('hides omitted page icons and an explicitly hidden title', () => {
    expect(
      galleryVisibilityClassName(
        galleryView({
          gallery_properties: [{ property: 'title', visible: false }]
        })
      )
    ).toBe('notion-gallery-hide-page-icons notion-gallery-hide-titles')
  })

  it('keeps a visible title while the omitted page-icon setting stays hidden', () => {
    expect(
      galleryVisibilityClassName(
        galleryView({
          gallery_properties: [{ property: 'title', visible: true }]
        })
      )
    ).toBe('notion-gallery-hide-page-icons')
  })

  it('keeps page icons visible when Notion explicitly enables them', () => {
    expect(
      galleryVisibilityClassName(
        galleryView({
          show_page_icon: true,
          gallery_properties: [{ property: 'title', visible: true }]
        })
      )
    ).toBe('')
  })

  it('preserves legacy Gallery data without the page-icon setting', () => {
    expect(
      galleryVisibilityClassName(galleryView({ gallery_title_visible: true }))
    ).toBe('')
  })
})

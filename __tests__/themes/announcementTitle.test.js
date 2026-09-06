import { render, screen } from '@testing-library/react'
import CommerceAnnouncement from '@/themes/commerce/components/Announcement'
import ExampleAnnouncement from '@/themes/example/components/Announcement'
import FukasawaAnnouncement from '@/themes/fukasawa/components/Announcement'
import FuwariAnnouncement from '@/themes/fuwari/components/Announcement'
import HexoAnnouncement from '@/themes/hexo/components/Announcement'
import MateryAnnouncement from '@/themes/matery/components/Announcement'
import MovieAnnouncement from '@/themes/movie/components/Announcement'
import NextAnnouncement from '@/themes/next/components/Announcement'
import ThoughtliteAnnouncement from '@/themes/thoughtlite/components/Announcement'
import XuhomeAnnouncement from '@/themes/xuhome/components/Announcement'

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      COMMON: {
        ANNOUNCEMENT: 'Announcement fallback'
      }
    }
  })
}))

const notice = {
  title: 'Custom notice title',
  blockMap: { block: {} }
}

describe('announcement titles', () => {
  test.each([
    ['commerce', CommerceAnnouncement, 'post'],
    ['example', ExampleAnnouncement, 'post'],
    ['fukasawa', FukasawaAnnouncement, 'post'],
    ['hexo', HexoAnnouncement, 'post'],
    ['matery', MateryAnnouncement, 'notice'],
    ['movie', MovieAnnouncement, 'post'],
    ['next', NextAnnouncement, 'post'],
    ['thoughtlite', ThoughtliteAnnouncement, 'post'],
    ['xuhome', XuhomeAnnouncement, 'post']
  ])('%s uses the Notion Notice page title', (_name, Component, propName) => {
    render(<Component {...{ [propName]: notice }} />)

    expect(screen.getByText(/Custom notice title/)).toBeInTheDocument()
  })

  it('fuwari prefers the Notion Notice page title over its fallback title prop', () => {
    render(<FuwariAnnouncement post={notice} title='Announcement fallback' />)

    expect(screen.getByText(/Custom notice title/)).toBeInTheDocument()
    expect(screen.queryByText('Announcement fallback')).not.toBeInTheDocument()
  })

  it('keeps the localized fallback when the Notice page has no title', () => {
    render(<HexoAnnouncement post={{ blockMap: { block: {} } }} />)

    expect(screen.getByText('Announcement fallback')).toBeInTheDocument()
  })
})

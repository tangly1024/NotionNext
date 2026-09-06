/**
 * @jest-environment node
 */

import { shouldHideFuwariSidebar } from '@/themes/fuwari/utils/sidebarVisibility'

describe('shouldHideFuwariSidebar', () => {
  it('keeps sidebar by default', () => {
    expect(shouldHideFuwariSidebar(undefined)).toBe(false)
    expect(shouldHideFuwariSidebar({})).toBe(false)
    expect(shouldHideFuwariSidebar({ type: 'Page' })).toBe(false)
  })

  it('hides for Notion full width', () => {
    expect(shouldHideFuwariSidebar({ fullWidth: true })).toBe(true)
  })

  it('hides for HIDE_SIDEBAR property', () => {
    expect(shouldHideFuwariSidebar({ HIDE_SIDEBAR: true })).toBe(true)
    expect(shouldHideFuwariSidebar({ HIDE_SIDEBAR: '是' })).toBe(true)
    expect(shouldHideFuwariSidebar({ HIDE_SIDEBAR: 'false' })).toBe(false)
    expect(shouldHideFuwariSidebar({ ext: { HIDE_SIDEBAR: 1 } })).toBe(true)
  })

  it('hides when SIDEBAR is false', () => {
    expect(shouldHideFuwariSidebar({ SIDEBAR: false })).toBe(true)
    expect(shouldHideFuwariSidebar({ SIDEBAR: '否' })).toBe(true)
    expect(shouldHideFuwariSidebar({ SIDEBAR: true })).toBe(false)
    expect(shouldHideFuwariSidebar({ ext: { SIDEBAR: 0 } })).toBe(true)
  })
})

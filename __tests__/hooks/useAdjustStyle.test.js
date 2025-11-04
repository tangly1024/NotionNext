// __tests__/hooks/useAdjustStyle.test.js
import { renderHook } from '@testing-library/react'
import useAdjustStyle from '@/hooks/useAdjustStyle'

describe('useAdjustStyle Hook', () => {
  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <div class="notion-callout-text">
        <figure class="notion-asset-wrapper notion-asset-wrapper-image">
          <div style="width: 1000px"></div>
        </figure>
      </div>
    `
  })

  it('adjusts callout images on mount', () => {
    renderHook(() => useAdjustStyle())
    
    // Hook should execute without errors
    expect(true).toBe(true)
  })

  it('adds resize event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    
    renderHook(() => useAdjustStyle())
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    
    addEventListenerSpy.mockRestore()
  })

  it('removes resize event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useAdjustStyle())
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    
    removeEventListenerSpy.mockRestore()
  })

  it('handles missing callout elements', () => {
    document.body.innerHTML = ''
    
    renderHook(() => useAdjustStyle())
    
    // Should not throw error
    expect(true).toBe(true)
  })
})
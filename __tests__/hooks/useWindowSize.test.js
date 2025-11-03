// __tests__/hooks/useWindowSize.test.ts
import { renderHook, act } from '@testing-library/react'
import useWindowSize from '@/hooks/useWindowSize'

describe('useWindowSize Hook', () => {
  beforeEach(() => {
    // Mock document dimensions
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 768
    })
  })

  it('returns initial window size', () => {
    const { result } = renderHook(() => useWindowSize())
    
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('updates size on window resize', () => {
    const { result } = renderHook(() => useWindowSize())
    
    act(() => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 800
      })
      Object.defineProperty(document.documentElement, 'clientHeight', {
        writable: true,
        configurable: true,
        value: 600
      })
      
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useWindowSize())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
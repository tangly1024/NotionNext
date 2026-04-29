import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const STORAGE_HUE_KEY = 'fuwari-theme-hue'

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const a = (s * Math.min(l, 1 - l))
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const ThemeColorSwitch = ({ onColorChange }) => {
  const enabled = siteConfig('FUWARI_WIDGET_THEME_COLOR_SWITCHER', true, CONFIG)
  const defaultHue = siteConfig('FUWARI_THEME_COLOR_HUE', 250, CONFIG)
  const [hue, setHue] = useState(defaultHue)
  const color = useMemo(() => hslToHex(hue, 85, 62), [hue])

  const applyColor = (nextColor, nextHue) => {
    const root = document.getElementById('theme-fuwari')
    if (!root) return
    root.style.setProperty('--fuwari-primary', nextColor)
    root.style.setProperty('--fuwari-primary-soft', `hsla(${nextHue}, 85%, 62%, 0.14)`)
    root.style.setProperty('--fuwari-gradient', `linear-gradient(135deg, hsl(${nextHue}, 85%, 62%) 0%, hsl(${(nextHue + 45) % 360}, 88%, 70%) 100%)`)
  }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_HUE_KEY)
    const initialHue = stored ? parseInt(stored, 10) : defaultHue
    setHue(initialHue)
    applyColor(hslToHex(initialHue, 85, 62), initialHue)
  }, [])

  const handleSelect = nextHue => {
    setHue(nextHue)
    localStorage.setItem(STORAGE_HUE_KEY, String(nextHue))
    const nextColor = hslToHex(nextHue, 85, 62)
    applyColor(nextColor, nextHue)
    onColorChange?.(nextColor)
  }

  if (!enabled) return null

  const copyHex = async () => {
    await navigator.clipboard.writeText(color)
  }

  return (
    <section className='fuwari-theme-panel p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='fuwari-section-title text-xl font-bold'>Theme Color</h3>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => handleSelect(defaultHue)}
            className='fuwari-tool-btn w-8 h-8'
            title='Reset default hue'>
            <i className='fas fa-rotate-left text-xs' />
          </button>
          <button
            type='button'
            onClick={copyHex}
            className='px-2 h-8 rounded-md bg-[var(--fuwari-bg-soft)] border border-[var(--fuwari-border)] text-[var(--fuwari-primary)] font-bold'>
            {hue}
          </button>
        </div>
      </div>
      <div className='fuwari-hue-wrap'>
        <input
          type='range'
          min='0'
          max='360'
          step='5'
          value={hue}
          onChange={e => handleSelect(parseInt(e.target.value, 10))}
          className='fuwari-hue-slider'
        />
      </div>
      <p className='text-xs text-[var(--fuwari-muted)] mt-2 break-all'>Current HEX: {color}</p>
    </section>
  )
}

export default ThemeColorSwitch


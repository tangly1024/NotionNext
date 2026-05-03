import { Moon, Sun } from '@/components/HeroIcons'
import { useEffect, useState } from 'react'

const getLocalStorageDarkMode = () => {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem('darkMode')
    if (value === 'dark' || value === 'true') return true
    if (value === 'light' || value === 'false') return false
    return null
  } catch {
    return null
  }
}

const readDomDarkMode = () => {
  if (typeof document === 'undefined') return false
  const root = document.documentElement
  const dataTheme = root.getAttribute('data-theme')
  if (dataTheme === 'dark') return true
  if (dataTheme === 'light') return false
  return root.classList.contains('dark')
}

const applyTheme = isDark => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const mode = isDark ? 'dark' : 'light'
  root.classList.remove(isDark ? 'light' : 'dark')
  root.classList.add(mode)
  root.setAttribute('data-theme', mode)
  root.style.colorScheme = mode
  try {
    localStorage.setItem('darkMode', String(isDark))
  } catch {}
}

const withInstantThemeSwitch = callback => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    callback()
    return
  }

  const root = document.documentElement
  root.classList.add('claude-theme-switching')
  callback()

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove('claude-theme-switching')
    })
  })
}

export default function DarkModeButton({ className = '' }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const fromStorage = getLocalStorageDarkMode()
    const initial =
      fromStorage !== null ? fromStorage : readDomDarkMode() || window.matchMedia('(prefers-color-scheme: dark)').matches

    withInstantThemeSwitch(() => applyTheme(initial))
    setIsDarkMode(initial)

    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setIsDarkMode(readDomDarkMode())
    })
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const handleToggle = () => {
    const next = !readDomDarkMode()
    withInstantThemeSwitch(() => applyTheme(next))
    setIsDarkMode(next)
  }

  return (
    <div className={`${className} flex justify-center dark:text-gray-200 text-gray-800`}>
      <div
        id='darkModeButton'
        onClick={handleToggle}
        className='hover:scale-110 cursor-pointer transform duration-200 w-5 h-5'>
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  )
}

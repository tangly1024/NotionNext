import { useEffect, useState } from 'react'
import { isBrowser } from '@/lib/utils'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    if (!isBrowser) return

    const handleBeforeInstall = e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallButton(false)
    }
    setDeferredPrompt(null)
  }

  if (!showInstallButton) return null

  return (
    <button
      onClick={handleInstall}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 9999,
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      安装应用
    </button>
  )
}

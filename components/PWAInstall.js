import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 全站 PWA 安装提示，监听浏览器 beforeinstallprompt 事件，延迟显示安装提示
 */
export default function PWAInstall() {
  const [show, setShow] = useState(false)
  const promptRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone
    ) {
      return
    }

    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed && Date.now() - Number(dismissed) < 7 * 86400000) {
      return
    }

    const handler = e => {
      e.preventDefault()
      promptRef.current = e
      timerRef.current = setTimeout(() => setShow(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleInstall = useCallback(() => {
    if (!promptRef.current) return
    promptRef.current.prompt()
    promptRef.current.userChoice.then(result => {
      if (result.outcome === 'accepted') {
        setShow(false)
      }
      promptRef.current = null
    })
  }, [])

  const handleDismiss = useCallback(() => {
    setShow(false)
    localStorage.setItem('pwa-dismissed', String(Date.now()))
    promptRef.current = null
  }, [])

  if (!show) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='/icon-192x192.png'
          alt=''
          width={40}
          height={40}
          style={styles.icon}
        />
        <div style={styles.text}>
          <p style={styles.title}>安装为应用</p>
          <p style={styles.desc}>更快访问，离线可用</p>
        </div>
        <button onClick={handleInstall} style={styles.btn}>
          安装
        </button>
        <button
          onClick={handleDismiss}
          style={styles.close}
          aria-label='关闭'
        >
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path
              d='M4 4l8 8M12 4l-8 8'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    width: 'calc(100% - 2rem)',
    maxWidth: '22rem',
    animation: 'pwa-slide-up .3s ease-out'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(26,26,46,0.95)',
    padding: '0.75rem 1rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(12px)'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: '0.5rem',
    flexShrink: 0
  },
  text: {
    flex: 1,
    minWidth: 0
  },
  title: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  desc: {
    margin: 0,
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  btn: {
    flexShrink: 0,
    borderRadius: '0.5rem',
    background: '#3b82f6',
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  close: {
    flexShrink: 0,
    padding: '0.25rem',
    color: 'rgba(255,255,255,0.4)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex'
  }
}

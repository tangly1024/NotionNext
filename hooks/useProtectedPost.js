import { useCallback, useEffect, useRef, useState } from 'react'

export default function useProtectedPost(initialPost, router) {
  const [unlocked, setUnlocked] = useState(null)
  const [unlocking, setUnlocking] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const request = useRef(null)
  const version = useRef(0)
  const identity = `${router.locale || ''}:${initialPost?.id || ''}`
  const identityRef = useRef(identity)
  identityRef.current = identity

  const validPassword = useCallback(
    async password => {
      if (!initialPost?.id || typeof password !== 'string' || !password)
        return false
      request.current?.abort()
      const controller = new AbortController()
      request.current = controller
      const currentVersion = ++version.current
      setUnlocking(true)
      setUnlockError('')
      try {
        const response = await fetch(
          `${router.basePath || ''}/api/post/unlock`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postId: initialPost.id,
              password,
              locale: router.locale
            }),
            cache: 'no-store',
            signal: controller.signal
          }
        )
        if (
          currentVersion !== version.current ||
          identityRef.current !== identity
        )
          return false
        if (response.status === 401) return false
        if (!response.ok)
          throw new Error(
            response.status === 429
              ? '尝试次数过多，请一分钟后重试。'
              : '文章暂时无法加载，请稍后重试。'
          )
        const { post, prev, next, recommendPosts } = await response.json()
        if (
          currentVersion !== version.current ||
          identityRef.current !== identity
        )
          return false
        if (post?.id !== initialPost.id || !post.blockMap?.block)
          throw new Error('文章暂时无法加载，请稍后重试。')
        setUnlocked({ identity, post, prev, next, recommendPosts })
        return true
      } catch (error) {
        if (
          error.name !== 'AbortError' &&
          currentVersion === version.current &&
          identityRef.current === identity
        ) {
          setUnlockError(
            error.message === 'Failed to fetch'
              ? '网络连接失败，请稍后重试。'
              : error.message
          )
        }
        return false
      } finally {
        if (
          currentVersion === version.current &&
          identityRef.current === identity
        )
          setUnlocking(false)
      }
    },
    [identity, initialPost?.id, router.locale, router.basePath]
  )

  useEffect(() => {
    setUnlocked(null)
    setUnlocking(false)
    setUnlockError('')
    if (!initialPost?.password) return
    let cancelled = false
    // Delay consuming legacy credentials until Strict Mode's setup/cleanup replay
    // finishes. The cancelled first setup must not erase the next setup's input.
    const unlockSavedPassword = async () => {
      await Promise.resolve()
      if (cancelled) return
    let candidates = []
    // Migrate existing password links/storage once, without saving new plaintext passwords.
    try {
      const url = new URL(window.location.href)
      const storageKey = `password_${url.pathname}`
      candidates.push(url.searchParams.get('password'))
      if (url.searchParams.has('password')) {
        url.searchParams.delete('password')
        window.history.replaceState(
          window.history.state,
          '',
          url.pathname + url.search + url.hash
        )
      }
      try {
        candidates.push(
          localStorage.getItem(storageKey),
          localStorage.getItem('password_default')
        )
        localStorage.removeItem(storageKey)
        localStorage.removeItem('password_default')
      } catch {
        /* Storage may be disabled. Manual unlock still works. */
      }
    } catch {
      /* No valid browser URL; use the password form. */
    }
    candidates = [...new Set(candidates.filter(Boolean))]
      for (const password of candidates) {
        if (cancelled || (await validPassword(password))) break
      }
    }
    unlockSavedPassword()
    return () => {
      cancelled = true
      version.current++
      request.current?.abort()
    }
  }, [identity, initialPost?.password, validPassword])

  const authorizedPost = unlocked?.identity === identity ? unlocked.post : null
  return {
    ...(authorizedPost ? {
      prev: unlocked.prev,
      next: unlocked.next,
      recommendPosts: unlocked.recommendPosts
    } : {}),
    post: authorizedPost || initialPost,
    lock: Boolean(initialPost?.password && !authorizedPost),
    validPassword,
    unlocking,
    unlockError
  }
}

import { useEffect, useRef, useState } from 'react'

const formatTime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  const seekFromClientX = clientX => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const next = ratio * duration
    audio.currentTime = next
    setCurrentTime(next)
  }

  const handlePointerDown = e => {
    e.preventDefault()
    setDragging(true)
    seekFromClientX(e.clientX)
  }

  const handlePointerMove = e => {
    if (dragging) seekFromClientX(e.clientX)
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onPlaying = () => {
      setPlaying(true)
      setLoading(false)
    }
    const onPause = () => {
      setPlaying(false)
      setLoading(false)
    }
    const onWaiting = () => setLoading(true)
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }
    const onError = () => {
      setLoading(false)
      setPlaying(false)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [src])

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className='flex items-center gap-3 border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-3 select-none'
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <audio ref={audioRef} src={src} preload='none' className='hidden' />

      <button
        onClick={togglePlay}
        aria-label={playing ? '暂停' : '播放'}
        className='w-10 h-10 shrink-0 flex items-center justify-center border-2 border-[#0284c7] rounded-sm bg-[#fde68a] text-[#0284c7] font-black text-base shadow-[2px_2px_0px_0px_#0284c7] hover:bg-[#0ea5e9] hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all'
      >
        {loading ? (
          <span className='inline-block w-3 h-3 border-2 border-[#0284c7] border-t-transparent rounded-full animate-spin' />
        ) : playing ? (
          <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor'>
            <rect x='2' y='1' width='4' height='12' rx='0.5' />
            <rect x='8' y='1' width='4' height='12' rx='0.5' />
          </svg>
        ) : (
          <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor'>
            <path d='M3 1.5v11l9-5.5z' />
          </svg>
        )}
      </button>

      <div className='flex-1 min-w-0'>
        <div
          ref={progressRef}
          onPointerDown={handlePointerDown}
          className='group relative h-4 cursor-pointer'
          role='slider'
          aria-valuemin='0'
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-label='播放进度'
        >
          <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 border-2 border-[#0284c7] rounded-sm bg-[#f1f5f9] dark:bg-slate-700 overflow-hidden'>
            <div
              className='h-full bg-[#0284c7] transition-[width] duration-100'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 border-2 border-[#0284c7] rounded-sm bg-[#fde68a] shadow-[1px_1px_0px_0px_#0284c7]'
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className='flex justify-between mt-1 text-[10px] font-black tabular-nums text-slate-500 dark:text-slate-400'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

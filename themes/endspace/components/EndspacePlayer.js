import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerTrackPrev,
  IconPlayerTrackNext,
  IconMusic,
  IconList,
  IconVolume,
} from '@tabler/icons-react'

/**
 * EndspacePlayer Component - Compact Sci-Fi Music Player for Endspace Theme
 * Integrates with widget.config.js settings
 * Has two states: expanded (full info) and collapsed (rotating cover when playing)
 * Tabler Icons for Futuristic Feel
 */
export const EndspacePlayer = ({ isExpanded }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Get configuration from widget.config.js
  const musicPlayerEnabled = siteConfig('MUSIC_PLAYER')
  const playOrder = siteConfig('MUSIC_PLAYER_ORDER')
  const audioList = siteConfig('MUSIC_PLAYER_AUDIO_LIST') || []

  // Don't render if disabled or no audio
  if (!musicPlayerEnabled || audioList.length === 0) {
    return null
  }

  const currentAudio = audioList[currentTrack] || {}

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.7
      
      audioRef.current.addEventListener('ended', handleTrackEnd)
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration)
      })
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio load error:', e)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('ended', handleTrackEnd)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Load track when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentAudio.url) {
      audioRef.current.src = currentAudio.url
      audioRef.current.load()
      setProgress(0)
      setCurrentTime(0)
      
      // Only auto-play on track switch if currently playing
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented:', e))
      }
    }
  }, [currentTrack, currentAudio.url, isPlaying])



  // Progress update
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const current = audioRef.current.currentTime
          const total = audioRef.current.duration || 1
          setCurrentTime(current)
          setProgress((current / total) * 100)
        }
      }, 200)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  // Close playlist when sidebar collapses
  useEffect(() => {
    if (!isExpanded) {
      setShowPlaylist(false)
    }
  }, [isExpanded])

  const handleTrackEnd = () => {
    if (playOrder === 'random') {
      const randomIndex = Math.floor(Math.random() * audioList.length)
      setCurrentTrack(randomIndex)
    } else {
      setCurrentTrack((prev) => (prev + 1) % audioList.length)
    }
  }

  const togglePlay = (e) => {
    e.stopPropagation()
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.muted = false
      audioRef.current.play().catch(e => console.log('Play prevented:', e))
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = (e) => {
    e?.stopPropagation()
    if (playOrder === 'random') {
      const randomIndex = Math.floor(Math.random() * audioList.length)
      setCurrentTrack(randomIndex)
    } else {
      setCurrentTrack((prev) => (prev + 1) % audioList.length)
    }
  }

  const playPrev = (e) => {
    e?.stopPropagation()
    setCurrentTrack((prev) => (prev - 1 + audioList.length) % audioList.length)
  }

  const selectTrack = (index) => {
    setCurrentTrack(index)
    setShowPlaylist(false)
    if (!isPlaying) {
      setTimeout(() => {
        if (audioRef.current) audioRef.current.muted = false
        audioRef.current?.play().catch(e => console.log('Play prevented:', e))
        setIsPlaying(true)
      }, 100)
    }
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    audioRef.current.currentTime = percentage * audioRef.current.duration
    setProgress(percentage * 100)
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Collapsed State: Rotating cover when playing, music icon when not
  if (!isExpanded) {
    return (
      <div className="endspace-player-mini flex justify-center py-2">
        <div 
          className={`relative w-10 h-10 cursor-pointer group flex items-center justify-center`}
          onClick={togglePlay}
        >
          {isPlaying ? (
            // Playing: Show rotating album cover
            <>
              <div className="w-full h-full rounded-full overflow-hidden endspace-player-glow endspace-player-rotating">
                <img 
                  src={currentAudio.cover || '/default-cover.jpg'} 
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Pause overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <IconPlayerPause size={14} stroke={2} className="text-white" />
              </div>
            </>
          ) : (
            // Not playing: Show music icon
            <div className="w-full h-full rounded-lg flex items-center justify-center bg-[var(--endspace-bg-secondary)] text-[var(--endspace-text-muted)] hover:text-gray-600 hover:bg-gray-200 transition-all">
              <IconMusic size={18} stroke={1.5} />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Expanded State: Compact player with album cover as play button
  return (
    <div className="endspace-player-full px-3 py-3 relative">
      {/* Main Content Row */}
      <div className="flex gap-3 items-start">
        {/* Album Cover with integrated play button */}
        <div 
          className={`relative flex-shrink-0 w-12 h-12 rounded cursor-pointer overflow-hidden group ${isPlaying ? 'endspace-player-glow' : ''}`}
          onClick={togglePlay}
        >
          <img 
            src={currentAudio.cover || '/default-cover.jpg'} 
            alt="Album Cover"
            className={`w-full h-full object-cover transition-transform duration-300 ${isPlaying ? 'scale-105' : ''}`}
          />
          {/* Play/Pause Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {isPlaying ? (
              <IconPlayerPause size={16} stroke={2} className="text-white" />
            ) : (
              <IconPlayerPlay size={16} stroke={2} className="text-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-sm font-bold text-[var(--endspace-text-primary)] truncate leading-tight">
            {currentAudio.name || 'Unknown Track'}
          </div>
          <div className="text-xs text-[var(--endspace-text-muted)] truncate mt-0.5">
            {currentAudio.artist || 'Unknown Artist'}
          </div>
          {/* Progress Bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div 
              className="flex-1 h-1 bg-[var(--endspace-bg-tertiary)] rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-[var(--endspace-accent-yellow)] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-[var(--endspace-text-muted)] w-8 text-right">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

          {/* Right side: Playlist button + Prev/Next buttons */}
        <div className="flex flex-col items-center gap-1">
          {/* Playlist Toggle Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowPlaylist(!showPlaylist) }}
            className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${showPlaylist ? 'bg-black text-white' : 'text-[var(--endspace-text-muted)] hover:text-black'}`}
            title="Playlist"
          >
            <IconList size={12} stroke={1.5} />
          </button>
          
          {/* Prev/Next Buttons (horizontal) */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={playPrev}
              className="w-5 h-5 flex items-center justify-center text-[var(--endspace-text-muted)] hover:text-black transition-colors"
              title="Previous"
            >
              <IconPlayerTrackPrev size={11} stroke={1.5} />
            </button>
            <button 
              onClick={playNext}
              className="w-5 h-5 flex items-center justify-center text-[var(--endspace-text-muted)] hover:text-black transition-colors"
              title="Next"
            >
              <IconPlayerTrackNext size={11} stroke={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Dropdown */}
      {showPlaylist && (
        <div className="mt-2 max-h-36 overflow-y-auto bg-[var(--endspace-bg-secondary)] rounded">
          {audioList.map((audio, index) => (
            <div 
              key={index}
              onClick={() => selectTrack(index)}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                index === currentTrack 
                  ? 'bg-black text-white' 
                  : 'hover:bg-[var(--endspace-bg-tertiary)]'
              }`}
            >
              {/* Song name line */}
              <div className={`text-xs truncate flex items-center gap-1.5 ${
                index === currentTrack ? 'text-white font-medium' : 'text-[var(--endspace-text-secondary)]'
              }`}>
                {index === currentTrack && isPlaying && (
                  <IconVolume size={11} stroke={1.5} className="flex-shrink-0" />
                )}
                {index === currentTrack && !isPlaying && (
                  <IconPlayerPause size={11} stroke={1.5} className="flex-shrink-0" />
                )}
                {index !== currentTrack && (
                  <span className="w-3 text-center font-mono text-[9px] text-[var(--endspace-text-muted)] flex-shrink-0">{index + 1}</span>
                )}
                <span className="truncate">{audio.name}</span>
              </div>
              {/* Artist name line (smaller) */}
              <div className="text-[10px] text-[var(--endspace-text-muted)] truncate pl-4 mt-0.5">
                {audio.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EndspacePlayer

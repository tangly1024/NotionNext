import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const EMOJIS = [
  { icon: '❤️', label: 'Loved it' },
  { icon: '👀', label: 'Just looking' },
  { icon: '👋', label: 'Hi there' },
  { icon: '👥', label: 'Me too' }
]

const API_URL = 'https://post-reaction.kahosense.workers.dev/api/reactions'

const EmojiReaction = ({ slug }) => {
  const [counts, setCounts] = useState({})
  const [activeLabel, setActiveLabel] = useState(null)

  // 🚫 容错：slug 为空时不渲染组件
  if (!slug) {
    console.warn('EmojiReaction: slug is missing')
    return null
  }

  // ✅ 获取点赞数据
  useEffect(() => {
    fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(err => console.error('EmojiReaction fetch error:', err))
  }, [slug])

  // ✅ 点赞逻辑
  const handleClick = (label, emoji) => {
    setCounts(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }))
    setActiveLabel(label)
    setTimeout(() => setActiveLabel(null), 1500)

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, emoji })
    }).catch(console.error)
  }

  return (
    <div className="flex w-full mt-14 mb-8"> 
      {EMOJIS.map(({ icon, label }) => (
        <button
          key={label}
          onClick={() => handleClick(label, icon)}
          className="w-1/4 flex flex-col items-center text-2xl select-none"
          aria-label={label}
        >
          <span
            className={`transition-all duration-200 ease-in-out ${
              activeLabel === label
                ? 'scale-125 -translate-y-1 text-red-500'
                : ''
            }`}
          >
            {icon}
          </span>
          <span className="mt-1 text-[10px] text-gray-500 flex items-center space-x-1">
            <span>{label}</span>
            {counts[icon] > 0 && (
              <span className="text-[10px] text-gray-400">{counts[icon]}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

export default EmojiReaction
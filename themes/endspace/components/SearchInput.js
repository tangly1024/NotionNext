import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IconSearch, IconX } from '@tabler/icons-react'

/**
 * SearchInput Component - Refined Tech Interface
 * Search input component
 */
export const SearchInput = ({ keyword = '', locale }) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(keyword || '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setSearchTerm(keyword || '')
  }, [keyword])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div className={`endspace-frame p-6 transition-colors ${isFocused ? 'border-[var(--endspace-accent-yellow)]' : ''}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Label */}
        <div className="flex items-center gap-2 text-black tech-text tracking-wider">
          <IconSearch size={24} stroke={1.5} />
          <span className="text-5xl font-black">SEARCH</span>
        </div>

        {/* Search Input Container */}
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={locale?.SEARCH?.ARTICLES || 'Input query...'}
            className="w-full px-4 py-3 bg-[var(--endspace-bg-secondary)] border border-[var(--endspace-border-base)] text-[var(--endspace-text-primary)] focus:bg-black focus:text-[#FBFB46] focus:border-[var(--endspace-accent-yellow)] focus:outline-none transition-colors pr-24 tech-text text-sm placeholder-[var(--endspace-text-muted)]"
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-[var(--endspace-text-muted)] hover:text-red-500 transition-colors px-2"
            >
              <IconX size={14} stroke={1.5} />
            </button>
          )}

          {/* Search Button (Enter) */}
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-[var(--endspace-bg-tertiary)] text-black hover:bg-[#FBFB46] hover:text-black transition-colors font-bold text-xs border-l border-[var(--endspace-border-base)]"
          >
            GO
          </button>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between text-[10px] text-[var(--endspace-text-muted)] font-mono">
          <div>
            SYSTEM_STATUS: <span className="text-green-500">ONLINE</span>
          </div>
          <div>
             Index_v4.2.0
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchInput

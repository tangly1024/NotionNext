import { useState } from 'react'
import { IconLock, IconAlertTriangle } from '@tabler/icons-react'

/**
 * PostLock Component - Password Protection
 */
export const PostLock = ({ validPassword }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === '') {
      setError(true)
      return
    }
    validPassword(password)
    setError(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="endspace-card p-8 max-w-md w-full tech-corner">
        {/* Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-block p-6 bg-yellow-400/10 border border-yellow-400/30 mb-4">
            <IconLock size={48} stroke={1.5} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tech-text">
            RESTRICTED ACCESS
          </h2>
          <p className="text-gray-400 text-sm">
            This content requires authorization
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2 tech-text">
              ENTER_PASSWORD:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                w-full px-4 py-3 bg-black border tech-text
                ${error ? 'border-red-500' : 'border-gray-700'}
                text-white focus:border-yellow-400 focus:outline-none
                transition-colors
              `}
              placeholder="Enter password..."
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 tech-text">
                <IconAlertTriangle size={12} stroke={1.5} className="inline mr-1" />
                INVALID_PASSWORD
              </p>
            )}
          </div>

          <button
            type="submit"
            className="endspace-button-primary w-full py-3 text-center font-bold tech-text"
          >
            <span className="mr-2">&gt;&gt;</span>
            UNLOCK
            <span className="ml-2">&lt;&lt;</span>
          </button>
        </form>

        {/* Status Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600 tech-text">
          <div>STATUS: LOCKED</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>UNAUTHORIZED</span>
          </div>
        </div>
      </div>
    </div>
  )
}

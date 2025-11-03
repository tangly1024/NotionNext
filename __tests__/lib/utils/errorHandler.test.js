// __tests__/lib/utils/errorHandler.test.js
import {
  AppError,
  NetworkError,
  ApiError,
  ValidationError,
  ErrorHandler,
  ErrorTypes
} from '@/lib/utils/errorHandler'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('creates error with correct properties', () => {
      const error = new AppError('Test error', ErrorTypes.CLIENT_ERROR, 400, { detail: 'info' })
      
      expect(error.message).toBe('Test error')
      expect(error.type).toBe(ErrorTypes.CLIENT_ERROR)
      expect(error.statusCode).toBe(400)
      expect(error.details).toEqual({ detail: 'info' })
      expect(error.timestamp).toBeDefined()
    })

    it('uses default values', () => {
      const error = new AppError('Test error')
      
      expect(error.type).toBe(ErrorTypes.UNKNOWN_ERROR)
      expect(error.statusCode).toBe(500)
      expect(error.details).toBe(null)
    })
  })

  describe('NetworkError', () => {
    it('creates network error with correct type', () => {
      const error = new NetworkError('Connection failed')
      
      expect(error.message).toBe('Connection failed')
      expect(error.type).toBe(ErrorTypes.NETWORK_ERROR)
      expect(error.statusCode).toBe(0)
    })

    it('uses default message', () => {
      const error = new NetworkError()
      
      expect(error.message).toBe('网络连接失败')
    })
  })

  describe('ApiError', () => {
    it('creates API error with status code', () => {
      const error = new ApiError('API failed', 404, { endpoint: '/api/test' })
      
      expect(error.message).toBe('API failed')
      expect(error.type).toBe(ErrorTypes.API_ERROR)
      expect(error.statusCode).toBe(404)
      expect(error.details).toEqual({ endpoint: '/api/test' })
    })
  })

  describe('ValidationError', () => {
    it('creates validation error', () => {
      const error = new ValidationError('Invalid input', { field: 'email' })
      
      expect(error.message).toBe('Invalid input')
      expect(error.type).toBe(ErrorTypes.VALIDATION_ERROR)
      expect(error.statusCode).toBe(400)
    })
  })
})

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('logError', () => {
    it('logs error with context', () => {
      const error = new AppError('Test error')
      ErrorHandler.logError(error, 'Test context')
      
      expect(console.error).toHaveBeenCalled()
    })

    it('logs different info in development vs production', () => {
      const originalEnv = process.env.NODE_ENV
      
      process.env.NODE_ENV = 'development'
      const error = new AppError('Dev error')
      ErrorHandler.logError(error)
      expect(console.error).toHaveBeenCalled()
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('handleApiError', () => {
    it('handles error with response', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      }
      
      expect(() => ErrorHandler.handleApiError(error)).toThrow(ApiError)
    })

    it('handles error without response', () => {
      const error = {
        request: {}
      }
      
      expect(() => ErrorHandler.handleApiError(error)).toThrow(NetworkError)
    })

    it('handles generic error', () => {
      const error = new Error('Generic error')
      
      expect(() => ErrorHandler.handleApiError(error)).toThrow(AppError)
    })
  })

  describe('safeExecute', () => {
    it('executes function successfully', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      const result = await ErrorHandler.safeExecute(fn)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalled()
    })

    it('returns fallback on error', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Failed'))
      const result = await ErrorHandler.safeExecute(fn, 'fallback')
      
      expect(result).toBe('fallback')
    })

    it('logs error when function fails', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Failed'))
      await ErrorHandler.safeExecute(fn, null, 'Test context')
      
      expect(console.error).toHaveBeenCalled()
    })
  })
})
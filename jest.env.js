// Jest environment setup
// This file is loaded before jest.setup.js

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_TITLE = 'Test Blog'
process.env.NEXT_PUBLIC_DESCRIPTION = 'Test Description'
process.env.NEXT_PUBLIC_AUTHOR = 'Test Author'
process.env.NEXT_PUBLIC_LANG = 'zh-CN'
process.env.NEXT_PUBLIC_THEME = 'test'
process.env.NEXT_PUBLIC_LINK = 'https://test.com'
process.env.NOTION_PAGE_ID = 'test-notion-id'

// Disable console warnings in tests
const originalWarn = console.warn
console.warn = (...args) => {
  // Suppress specific warnings
  const suppressedWarnings = [
    'Warning: ReactDOM.render is no longer supported',
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillReceiveProps has been renamed',
    'Warning: componentWillUpdate has been renamed'
  ]
  
  const message = args[0]
  if (typeof message === 'string' && suppressedWarnings.some(warning => message.includes(warning))) {
    return
  }
  
  originalWarn.apply(console, args)
}

// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific log levels
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock Next.js modules that are commonly used in tests
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  })
}));

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

// Setup global test timeout
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.NOTION_PAGE_ID = 'test-page-id';

// Global test utilities
global.testUtils = {
  // Helper to create mock HTTP request/response objects
  createMockContext: () => ({
    req: {
      method: 'GET',
      url: '/sitemap.xml',
      headers: {}
    },
    res: {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
      write: jest.fn()
    }
  }),
  
  // Helper to wait for async operations
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to validate XML structure
  isValidXML: (xmlString) => {
    try {
      // Basic XML validation
      return xmlString.includes('<?xml') && 
             xmlString.includes('<urlset') && 
             xmlString.includes('</urlset>');
    } catch {
      return false;
    }
  }
};
/**
 * Mock Notion data for testing sitemap functionality
 * This provides realistic test data that mimics the structure from Notion API
 */

// Mock blog posts with various statuses
const mockPosts = [
  {
    id: 'post-1',
    slug: 'published-post-1',
    title: 'Published Post 1',
    status: 'Published',
    type: 'Post',
    date: '2024-01-15',
    lastEditedTime: '2024-01-15T10:00:00.000Z',
    category: 'Technology',
    tags: ['JavaScript', 'Web Development'],
    summary: 'This is a published post about JavaScript',
    cover: 'https://example.com/cover1.jpg'
  },
  {
    id: 'post-2',
    slug: 'published-post-2',
    title: 'Published Post 2',
    status: 'Published',
    type: 'Post',
    date: '2024-01-20',
    lastEditedTime: '2024-01-20T14:30:00.000Z',
    category: 'Design',
    tags: ['UI/UX', 'Design'],
    summary: 'This is a published post about design',
    cover: 'https://example.com/cover2.jpg'
  },
  {
    id: 'post-3',
    slug: 'draft-post',
    title: 'Draft Post',
    status: 'Draft',
    type: 'Post',
    date: '2024-01-25',
    lastEditedTime: '2024-01-25T09:15:00.000Z',
    category: 'Technology',
    tags: ['React'],
    summary: 'This is a draft post that should not appear in sitemap'
  },
  {
    id: 'post-4',
    slug: 'archived-post',
    title: 'Archived Post',
    status: 'Archived',
    type: 'Post',
    date: '2024-01-10',
    lastEditedTime: '2024-01-10T16:45:00.000Z',
    category: 'Technology',
    tags: ['Archive'],
    summary: 'This is an archived post that should not appear in sitemap'
  },
  {
    id: 'post-5',
    slug: 'published-post-with-special-chars',
    title: 'Published Post with Special Characters & Symbols',
    status: 'Published',
    type: 'Post',
    date: '2024-01-30',
    lastEditedTime: '2024-01-30T11:20:00.000Z',
    category: 'Technology',
    tags: ['Testing', 'XML'],
    summary: 'This post tests XML escaping with <tags> & "quotes"',
    cover: 'https://example.com/cover3.jpg'
  }
];

// Mock pages
const mockPages = [
  {
    id: 'page-1',
    slug: 'about',
    title: 'About Us',
    status: 'Published',
    type: 'Page',
    date: '2024-01-01',
    lastEditedTime: '2024-01-01T12:00:00.000Z',
    summary: 'About page'
  },
  {
    id: 'page-2',
    slug: 'contact',
    title: 'Contact',
    status: 'Published',
    type: 'Page',
    date: '2024-01-02',
    lastEditedTime: '2024-01-02T13:00:00.000Z',
    summary: 'Contact page'
  },
  {
    id: 'page-3',
    slug: 'privacy',
    title: 'Privacy Policy',
    status: 'Draft',
    type: 'Page',
    date: '2024-01-03',
    lastEditedTime: '2024-01-03T14:00:00.000Z',
    summary: 'Privacy policy page (draft)'
  }
];

// Mock categories
const mockCategories = [
  { name: 'Technology', count: 3 },
  { name: 'Design', count: 1 }
];

// Mock tags
const mockTags = [
  { name: 'JavaScript', count: 1 },
  { name: 'Web Development', count: 1 },
  { name: 'UI/UX', count: 1 },
  { name: 'Design', count: 1 },
  { name: 'React', count: 1 },
  { name: 'Testing', count: 1 },
  { name: 'XML', count: 1 }
];

// Mock blog configuration
const mockBlogConfig = {
  BLOG: {
    LINK: 'https://example.com',
    NOTION_PROPERTY_NAME: {
      status_publish: 'Published'
    },
    SITEMAP_ENHANCED: {
      ENABLE: true,
      SPLIT_BY_TYPE: true,
      INCLUDE_IMAGES: true,
      INCLUDE_INDEX: true,
      MAX_URLS_PER_FILE: 1000
    }
  }
};

// Helper functions for tests
const getPublishedPosts = () => mockPosts.filter(post => post.status === 'Published');
const getPublishedPages = () => mockPages.filter(page => page.status === 'Published');
const getAllPublishedContent = () => [...getPublishedPosts(), ...getPublishedPages()];

// Mock functions that simulate Notion API calls
const mockNotionAPI = {
  getAllPosts: jest.fn(() => Promise.resolve(mockPosts)),
  getAllPages: jest.fn(() => Promise.resolve(mockPages)),
  getAllCategories: jest.fn(() => Promise.resolve(mockCategories)),
  getAllTags: jest.fn(() => Promise.resolve(mockTags)),
  getPublishedPosts: jest.fn(() => Promise.resolve(getPublishedPosts())),
  getPublishedPages: jest.fn(() => Promise.resolve(getPublishedPages()))
};

// Error scenarios for testing error handling
const mockErrorScenarios = {
  networkError: () => {
    mockNotionAPI.getAllPosts.mockRejectedValueOnce(new Error('Network error'));
  },
  timeoutError: () => {
    mockNotionAPI.getAllPosts.mockRejectedValueOnce(new Error('Request timeout'));
  },
  invalidData: () => {
    mockNotionAPI.getAllPosts.mockResolvedValueOnce([
      { id: 'invalid', slug: null, title: null, status: null }
    ]);
  },
  emptyResponse: () => {
    mockNotionAPI.getAllPosts.mockResolvedValueOnce([]);
  }
};

module.exports = {
  mockPosts,
  mockPages,
  mockCategories,
  mockTags,
  mockBlogConfig,
  getPublishedPosts,
  getPublishedPages,
  getAllPublishedContent,
  mockNotionAPI,
  mockErrorScenarios
};
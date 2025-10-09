# Technical Context

## Technology Stack

### Core Framework
- **Next.js 14.2.30**: React framework with SSR/SSG capabilities
- **React 18.3.1**: UI library with concurrent features
- **Node.js 20+**: JavaScript runtime (minimum requirement)

### Styling & UI
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **PostCSS 8.5.6**: CSS post-processing
- **Autoprefixer 10.4.21**: CSS vendor prefixing

### Content & Data
- **Notion API v3**: Content management and synchronization
- **notion-client 7.3.0**: Notion API client library
- **notion-utils 7.4.3**: Notion content utilities
- **react-notion-x 7.4.2**: React components for Notion content

### Development Tools
- **TypeScript 5.6.2**: Type safety and development experience
- **ESLint 8.57.1**: Code linting and quality
- **Prettier 3.6.2**: Code formatting
- **Jest 29.7.0**: Testing framework

### External Integrations
- **Algolia**: Full-text search functionality
- **Vercel Analytics**: Performance and usage analytics
- **Redis (ioredis)**: Caching and performance optimization
- **Various comment systems**: Twikoo, Giscus, Gitalk, etc.

## Development Environment

### Local Development Setup
```bash
# Node.js version management
nvm use 20  # Use Node.js 20+

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Start production server
npm run start
# or
yarn start
```

### Development Tools
- **Visual Studio Code**: Primary IDE
- **ESLint + Prettier**: Code quality and formatting
- **TypeScript**: Type checking and IntelliSense
- **Jest**: Unit and integration testing
- **Git**: Version control

### Build Process
1. **Dependency Resolution**: npm/yarn install
2. **Type Checking**: TypeScript compilation
3. **Linting**: ESLint code quality checks
4. **Code Formatting**: Prettier formatting
5. **Static Generation**: Next.js build process
6. **Optimization**: Bundle analysis and optimization

## Technical Constraints

### Notion API Limitations
- **Rate Limiting**: Notion API has rate limits that must be respected
- **Content Types**: Limited to Notion's supported block types
- **Database Schemas**: Dependent on user's Notion database structure
- **API Version**: Tied to Notion API v3 stability

### Vercel Platform Constraints
- **Build Time**: 15-minute build timeout for Pro accounts
- **Function Timeout**: API routes limited to 10 seconds (Pro) or 15 seconds (Enterprise)
- **Environment Variables**: Limited to 100 variables
- **Bandwidth**: Soft limits on bandwidth usage

### Performance Constraints
- **Bundle Size**: Must keep JavaScript bundles optimized
- **Image Optimization**: Limited concurrent image processing
- **Static Generation**: Build time grows with content volume
- **CDN Cache**: Cache invalidation timing considerations

## Dependencies Analysis

### Production Dependencies
```json
{
  "@clerk/nextjs": "^5.7.5",           // Authentication
  "@headlessui/react": "^1.7.19",      // Accessible UI components
  "@next/bundle-analyzer": "^12.3.7",  // Bundle analysis
  "@vercel/analytics": "^1.5.0",       // Analytics
  "algoliasearch": "^4.25.2",          // Search functionality
  "axios": "^1.7.2",                   // HTTP client
  "critters": "^0.0.23",               // CSS optimization
  "feed": "^4.2.2",                    // RSS feed generation
  "ioredis": "^5.6.1",                 // Redis client
  "js-md5": "^0.8.3",                  // MD5 hashing
  "lodash.throttle": "^4.1.1",         // Performance optimization
  "memory-cache": "^0.2.0",            // In-memory caching
  "next": "^14.2.30",                  // React framework
  "notion-client": "7.3.0",            // Notion API client
  "notion-utils": "7.4.3",             // Notion utilities
  "react": "^18.3.1",                  // UI library
  "react-dom": "^18.3.1",              // DOM rendering
  "react-facebook": "^8.1.4",          // Facebook integration
  "react-hotkeys-hook": "^4.6.2",      // Keyboard shortcuts
  "react-notion-x": "7.4.2",           // Notion content rendering
  "react-share": "^5.2.2",             // Social sharing
  "react-tweet-embed": "~2.0.0"        // Twitter integration
}
```

### Development Dependencies
```json
{
  "@types/node": "22.15.3",                    // Node.js types
  "@types/react": "18.3.10",                   // React types
  "@typescript-eslint/eslint-plugin": "^7.18.0", // TypeScript linting
  "@typescript-eslint/parser": "^7.18.0",      // TypeScript parsing
  "@waline/client": "^3.6.0",                  // Comment system
  "cross-env": "^7.0.3",                       // Environment variables
  "eslint": "^8.57.1",                         // Code linting
  "eslint-config-next": "^13.5.11",            // Next.js linting
  "eslint-config-prettier": "^9.1.0",          // Prettier integration
  "eslint-plugin-import": "^2.32.0",           // Import linting
  "eslint-plugin-node": "^11.1.0",             // Node.js linting
  "eslint-plugin-prettier": "^5.5.1",          // Prettier integration
  "eslint-plugin-react": "^7.37.5",            // React linting
  "eslint-plugin-react-hooks": "^4.6.2",       // React hooks linting
  "next-sitemap": "^1.9.12",                   // Sitemap generation
  "postcss": "^8.5.6",                         // CSS processing
  "prettier": "^3.6.2",                        // Code formatting
  "tailwindcss": "^3.4.17",                    // CSS framework
  "typescript": "5.6.2",                       // TypeScript compiler
  "webpack-bundle-analyzer": "^4.5.0",        // Bundle analysis
  "@testing-library/jest-dom": "^6.1.4",       // Testing utilities
  "@testing-library/react": "^14.1.2",         // React testing
  "@testing-library/user-event": "^14.5.1",    // User interaction testing
  "jest": "^29.7.0",                           // Testing framework
  "jest-environment-jsdom": "^29.7.0",         // DOM testing environment
  "jest-junit": "^16.0.0"                      // Test reporting
}
```

## Tool Usage Patterns

### Code Quality Tools
- **ESLint**: Automated linting on pre-commit hooks
- **Prettier**: Automatic code formatting on save
- **TypeScript**: Strict type checking in CI/CD
- **Jest**: Unit and integration testing

### Development Workflow
```bash
# Pre-commit quality checks
npm run pre-commit  # Runs lint:fix, format, and type-check

# Development tools
npm run dev-tools   # Various development utilities

# Testing
npm run test        # Run test suite
npm run test:watch  # Watch mode for development
npm run test:coverage # Generate coverage reports

# Build analysis
npm run bundle-report # Analyze bundle sizes
```

### Deployment Tools
- **Vercel CLI**: Deployment and preview management
- **Git Hooks**: Automated quality checks on commit
- **Bundle Analyzer**: Performance monitoring and optimization

## Environment Configuration

### Environment Variables
```bash
# Required
NOTION_PAGE_ID=your_notion_page_id
NEXT_PUBLIC_THEME=your_theme_name

# Optional
API_BASE_URL=https://www.notion.so/api/v3
NEXT_PUBLIC_LANG=zh-CN
NEXT_PUBLIC_AUTHOR=Your Name
NEXT_PUBLIC_SINCE=2021
# ... many more configuration options
```

### Configuration Hierarchy
1. **Environment Variables** (highest priority)
2. **Notion Database Configuration** (runtime overrides)
3. **Theme Configuration Files** (/conf/ directory)
4. **Main Configuration** (blog.config.js)

## Performance Optimization

### Build Optimizations
- **Bundle Splitting**: Automatic code splitting by Next.js
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Multiple formats and sizes
- **CSS Optimization**: PostCSS and Critters for CSS

### Runtime Optimizations
- **Static Generation**: Pre-rendered pages for performance
- **Incremental Regeneration**: Update pages without full rebuild
- **Caching Strategy**: Multi-level caching (build, runtime, CDN)
- **Lazy Loading**: Components and images loaded on demand

### Monitoring Tools
- **Bundle Analyzer**: Webpack bundle analysis
- **Lighthouse CI**: Performance monitoring
- **Vercel Analytics**: Real user monitoring
- **Core Web Vitals**: Performance metrics tracking

## Security Considerations

### API Security
- **Environment Variables**: Sensitive data stored securely
- **API Rate Limiting**: Respect Notion API limits
- **Input Validation**: All user inputs validated and sanitized
- **Error Handling**: Safe error messages without data leaks

### Content Security
- **XSS Prevention**: React's built-in XSS protection
- **Content Sanitization**: Notion content properly sanitized
- **External Links**: Safe handling of external resources
- **CSP Headers**: Content Security Policy implementation

## Deployment Architecture

### Vercel Deployment
- **Serverless Functions**: API routes as serverless functions
- **Edge Runtime**: Global content delivery
- **Automatic Deployments**: Git push triggers deployments
- **Preview Deployments**: Branch-based preview environments

### Build Process
1. **Git Push**: Triggers Vercel build
2. **Dependency Installation**: npm ci in clean environment
3. **Build Execution**: Next.js static generation
4. **Static Optimization**: Image and asset optimization
5. **Deployment**: Global CDN distribution

## Development Best Practices

### Code Organization
- **Feature-based Structure**: Components organized by feature
- **Shared Utilities**: Common functions in /lib directory
- **Type Definitions**: Centralized type definitions
- **Configuration Separation**: Settings split across multiple files

### Performance Guidelines
- **Image Optimization**: Always use Next.js Image component
- **Bundle Size**: Monitor and optimize bundle sizes
- **Static Generation**: Prefer static generation over SSR where possible
- **Code Splitting**: Use dynamic imports for large components

### Quality Assurance
- **Type Safety**: Strict TypeScript configuration
- **Testing**: Unit tests for utilities and components
- **Linting**: Comprehensive ESLint rules
- **Documentation**: Keep documentation updated

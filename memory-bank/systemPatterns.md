# System Patterns

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                            Vercel Platform                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Next.js   │  │   Notion    │  │  External   │              │
│  │   Server    │  │    API      │  │  Services   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│           │             │                    │                  │
│           └─────────────┼────────────────────┘                  │
│                         │                                       │
├─────────────────────────┼───────────────────────────────────────┤
│  ┌─────────────┐  ┌──────▼──────┐  ┌─────────────┐              │
│  │   Theme     │  │  Component  │  │   Plugin    │              │
│  │   System    │  │  Library    │  │   System    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    Configuration Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ blog.config │  │   /conf/    │  │ Environment │              │
│  │    .js      │  │  Directory  │  │ Variables   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Core Layers
1. **Platform Layer**: Vercel deployment with global CDN
2. **Application Layer**: Next.js SSR/SSG with API routes
3. **Content Layer**: Notion API integration
4. **Presentation Layer**: Theme system with component library
5. **Configuration Layer**: Multi-source configuration management

## Key Technical Decisions

### Framework Choice: Next.js
**Decision**: Next.js 14+ with App Router
**Rationale**:
- Excellent static generation capabilities (SSG)
- Built-in image optimization
- Automatic code splitting
- SEO-friendly with metadata API
- Strong performance optimizations
- Large ecosystem and community support

### Content Management: Notion API
**Decision**: Notion as the single source of truth for content
**Rationale**:
- No content migration needed
- Real-time content synchronization
- Rich media support out of the box
- Database-driven organization
- Familiar interface for users

### Styling Approach: Tailwind CSS
**Decision**: Utility-first CSS framework
**Rationale**:
- Small bundle size
- Consistent design system
- Easy customization
- Good performance
- Large component ecosystem

### Theme Architecture: Dynamic Loading
**Decision**: Runtime theme switching with dynamic imports
**Rationale**:
- No build-time theme compilation needed
- Easy theme development and distribution
- Consistent theme structure across all themes
- Hot-reloadable theme development

## Design Patterns

### Configuration Pattern
**Pattern**: Multi-source configuration with fallback hierarchy
**Implementation**:
```javascript
// Configuration hierarchy (highest to lowest priority)
1. Notion database configuration (runtime)
2. Environment variables (deployment)
3. Theme-specific config files (/conf/)
4. Main blog.config.js (project defaults)
```

**Benefits**:
- Environment-specific overrides
- Runtime customization via Notion
- Theme-specific configurations
- Easy maintenance and updates

### Component Architecture Pattern
**Pattern**: Feature-based component organization
**Structure**:
```
components/
├── ui/                 # Reusable UI components
├── features/           # Feature-specific components
│   ├── comments/       # Comment system components
│   ├── analytics/      # Analytics components
│   └── theme/          # Theme-specific components
└── layout/             # Layout components
```

**Benefits**:
- Clear separation of concerns
- Reusable components across themes
- Easy testing and maintenance
- Scalable architecture

### Plugin System Pattern
**Pattern**: Event-driven plugin architecture
**Implementation**:
- Plugin registration system
- Event emission for lifecycle hooks
- Configuration-driven plugin behavior
- Isolated plugin contexts

**Benefits**:
- Easy extensibility
- Third-party integrations
- Feature modularity
- Reduced core complexity

### Theme System Pattern
**Pattern**: Dynamic theme loading with consistent structure
**Structure**:
```
themes/
└── [theme-name]/
    ├── index.js           # Theme entry point
    ├── components/        # Theme-specific components
    ├── styles/           # Theme styles
    └── config.js         # Theme configuration
```

**Benefits**:
- Consistent theme development experience
- Easy theme switching
- Isolated theme logic
- Performance optimization (code splitting)

## Component Relationships

### Core Component Hierarchy
```
DynamicLayout (Theme Router)
├── LayoutIndex (Homepage)
├── LayoutPost (Article Pages)
├── LayoutPage (Custom Pages)
├── LayoutArchive (Archive/Category)
├── LayoutSearch (Search Results)
└── Layout404 (Error Pages)
```

### Data Flow Architecture
```
Notion API
    ↓
getSiteData() [lib/db/]
    ↓
Global Context Provider
    ↓
Theme Components
    ↓
Static Generation (getStaticProps)
    ↓
Vercel Deployment
```

### State Management
**Pattern**: React Context with custom hooks
**Implementation**:
- Global site data context
- Theme configuration context
- User preference context (dark mode, etc.)
- Plugin state management

## Critical Implementation Paths

### Content Synchronization Path
1. **Build Time**:
   - `getStaticProps` fetches from Notion API
   - Content parsed and processed
   - Static pages generated
   - Sitemap and RSS feeds created

2. **Runtime**:
   - Incremental static regeneration (ISR)
   - Cache invalidation on content updates
   - Real-time preview for draft content

### Theme Loading Path
1. **Theme Resolution**:
   - Read theme from configuration
   - Dynamic import of theme components
   - Fallback to default theme if needed

2. **Component Resolution**:
   - Map layout names to theme components
   - Inject global context and props
   - Render with error boundaries

### Configuration Resolution Path
1. **Source Priority** (highest to lowest):
   - Notion database configuration
   - Environment variables
   - Theme-specific config files
   - Main blog.config.js

2. **Type Conversion**:
   - String parsing for objects/arrays
   - Boolean conversion
   - URL validation
   - Fallback to defaults

## Performance Patterns

### Static Generation Strategy
- **SSG for Known Paths**: Pre-generate all article and page paths
- **ISR for Dynamic Content**: Regenerate pages on content updates
- **Client-Side Rendering**: Interactive components only

### Caching Strategy
- **Build Cache**: Next.js build cache for faster rebuilds
- **Runtime Cache**: ISR cache with configurable revalidation
- **CDN Cache**: Vercel CDN for global content delivery
- **Browser Cache**: Service worker for offline capability

### Image Optimization Strategy
- **Next.js Image Component**: Automatic optimization
- **Multiple Formats**: AVIF, WebP support
- **Responsive Images**: Multiple sizes for different devices
- **Lazy Loading**: Progressive image loading

## Security Patterns

### Content Security
- **Input Sanitization**: All Notion content sanitized
- **XSS Prevention**: React's built-in XSS protection
- **CSP Headers**: Content Security Policy configuration
- **Safe External Links**: External link handling

### API Security
- **Environment Variables**: Sensitive data in env vars
- **API Rate Limiting**: Notion API rate limit handling
- **Error Handling**: Safe error messages without data leaks

## Deployment Patterns

### Build Process
1. **Dependency Installation**: npm/yarn install
2. **Type Checking**: TypeScript compilation
3. **Linting**: ESLint code quality checks
4. **Static Generation**: Next.js build process
5. **Optimization**: Bundle analysis and optimization

### Deployment Pipeline
1. **Vercel Integration**: Git-based deployments
2. **Environment Setup**: Automatic env var injection
3. **Build Execution**: Serverless function deployment
4. **CDN Distribution**: Global content distribution

## Error Handling Patterns

### Error Boundaries
- **Component Level**: React error boundaries for component failures
- **Build Level**: Build process error handling
- **Runtime Level**: Graceful degradation for API failures

### Fallback Strategies
- **Theme Fallbacks**: Default theme if custom theme fails
- **Content Fallbacks**: Cached content if API fails
- **Layout Fallbacks**: Basic layout if theme components fail

## Testing Patterns

### Testing Strategy
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API and data flow tests
- **E2E Tests**: Critical user journey tests
- **Performance Tests**: Core Web Vitals monitoring

### Test Organization
- **Component Tests**: `__tests__/components/`
- **Utility Tests**: `__tests__/lib/`
- **Integration Tests**: API route and data flow tests

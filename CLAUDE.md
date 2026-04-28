# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CharliiAI is a content and tooling site built with Next.js and the Notion API, deployed on Vercel. It is designed for teams and creators who want a customizable publishing workflow backed by Notion.

**Requirements**: Node.js >=20 (specified in package.json engines)

**Project Directory**: The project code lives in the current repository root.

## Development Commands

### Initial Setup
```bash
npm install              # Install dependencies
cp .env.example .env.local   # Create local environment file
# Edit .env.local and set NOTION_PAGE_ID to your Notion database ID

# Optional: Initialize development environment and Git hooks
npm run init-dev         # Initialize development environment
npm run setup-hooks      # Install Git pre-commit and pre-push hooks
```

### Core Development
- `npm run dev` - Start development server (default: http://localhost:3000)
- `npm run build` - Build for production (sets BUILD_MODE=true)
- `npm start` - Start production server
- `npm run export` - Export as static site (sets EXPORT=true, BUILD_MODE=true)

### Special Build Commands
- `npm run build-all-in-dev` - Build with production environment variables in dev (sets VERCEL_ENV=production)
- `npm run bundle-report` - Analyze bundle size with webpack-bundle-analyzer (sets ANALYZE=true)
- `npm run post-build` - Generate sitemap after build
- `npm run version` - Display current package version

### Code Quality & Analysis
- **ESLint**: Configured with TypeScript support and Prettier integration
  - Run: `npm run lint` - Check code quality
  - Run: `npm run lint:fix` - Auto-fix ESLint errors
  - Config: `.eslintrc.js` with TypeScript rules, ignores errors during builds
- **Prettier**: Code formatting with `.prettierrc.json` configuration
  - Run: `npm run format` - Format all files
  - Run: `npm run format:check` - Check formatting without making changes
- **TypeScript**: Partial TypeScript support enabled
  - Run: `npm run type-check` - Check TypeScript types
  - Config: `tsconfig.json` and `tsconfig.eslint.json`
- **Bundle Analysis**: `npm run bundle-report` - Analyze bundle size

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode (no watch, with coverage)
- **Test Structure**: Tests located in `__tests__/` directory with subdirectories for `components/` and `lib/`
- **Configuration**: `jest.config.js`, `jest.setup.js`, `jest.env.js`
- **Coverage Threshold**: 70% for branches, functions, lines, and statements

### Development Utilities
- `npm run dev-tools` - Show available development tools
- `npm run clean` - Clean project files (cache, build artifacts)
- `npm run check-updates` - Check for dependency updates
- `npm run docs` - Generate project documentation
- `npm run quality` - Run comprehensive quality checks (lint + format + type-check)
- `npm run pre-commit` - Run pre-commit checks (lint:fix + format + type-check)
- `npm run health-check` - Check project health
- `npm run validate` - Alias for health-check
- `npm run final-validation` - Final validation before deployment

### Git Hooks Management
- `npm run setup-hooks` - Install Git hooks (pre-commit, pre-push)
- `npm run check-hooks` - Check Git hooks status
- `npm run remove-hooks` - Remove Git hooks

## Architecture Overview

### Multi-Theme System
The project implements a sophisticated theme system where each theme is a complete layout implementation:

- **Theme Directory**: `/themes/[theme-name]/`
- **Theme Structure**: Each theme contains:
  - `index.js` - Main theme entry point with layout components
  - `config.js` - Theme-specific configuration
  - `style.js` - Theme-specific styles
  - `components/` - Theme-specific components

**Current Theme**: Set via `THEME` in `blog.config.js` (default: 'simple')

**Available Themes**: commerce, example, fukasawa, game, gitbook, heo, hexo, landing, magzine, matery, medium, movie, nav, next, nobelium, photo, plog, proxio, simple, starter, typography

### Core Directory Structure

#### `/lib/` - Core Business Logic
- **`/lib/notion/`** - Notion API integration and data fetching
- **`/lib/cache/`** - Multi-layer caching system (memory, file, Redis)
- **`/lib/lang/`** - Internationalization support
- **`/lib/plugins/`** - Third-party integrations (analytics, comments, etc.)
- **`/lib/utils/`** - Utility functions and helpers

#### `/components/` - Shared Components
Reusable components used across themes for features like:
- Analytics, comments, search, SEO
- External integrations (Algolia, Google Analytics, etc.)
- UI elements (loading, notifications, etc.)

#### `/pages/` - Next.js Routing
- Dynamic routing with `[prefix]/[slug]/[...suffix].js` pattern
- Multi-language support through URL prefixes
- API routes for subscriptions and caching

#### `/scripts/` - Development Utilities
Contains helper scripts for project management:
- `dev-tools.js` - Development tools menu (init, clean, docs, check-updates)
- `health-check.js` - Project health validation
- `quality-check.js` - Code quality checks (lint + format + type-check)
- `setup-git-hooks.js` - Git hooks management (install/remove/check)
- `final-validation.js` - Pre-deployment validation

#### `/conf/` - Modular Configuration
Configuration is split into focused modules:
- `comment.config.js` - Comment system configuration (Twikoo, Giscus, Gitalk, etc.)
- `analytics.config.js` - Analytics and tracking (Google Analytics, Umami, etc.)
- `plugin.config.js` - Third-party plugin settings (Algolia search, etc.)
- `ad.config.js` - Advertisement and monetization
- `animation.config.js` - UI animations and effects
- `code.config.js` - Code block styling and highlighting
- `contact.config.js` - Author contact information
- `font.config.js` - Typography and font configuration
- `image.config.js` - Image processing and optimization
- `layout-map.config.js` - Custom route-to-layout mappings
- `notion.config.js` - Extended Notion API configuration
- `post.config.js` - Post and listing behavior
- `right-click-menu.js` - Custom context menu configuration
- `widget.config.js` - Floating widgets (chat, music player, etc.)
- `dev.config.js` - Development and debugging settings

### Key Architectural Patterns

#### Theme Aliasing System
- Webpack alias `@theme-components` dynamically maps to current theme directory
- Allows themes to override default components while maintaining common interfaces

#### Multi-Language Support
- Configurable via `NOTION_PAGE_ID` with format: `pageId,lang:pageId,lang:pageId`
- Automatic locale detection and URL rewriting
- Language-specific content routing

#### Notion Integration
- Uses `notion-client` and `react-notion-x` for rendering Notion content
- Custom API wrapper in `/lib/notion/` for data transformation
- Supports custom page properties and metadata

#### Caching Strategy
- Multi-layer caching: memory → file → Redis
- Configurable cache invalidation via `NEXT_REVALIDATE_SECOND`
- Smart cache management for Notion data

### Vercel ISR Guardrails
- Treat `ISR Writes` as a deployment review item, not only a billing issue.
- Avoid broad default invalidation in API routes. `pages/api/revalidate.js` must only refresh explicitly requested paths.
- Never ship `revalidate = 1/5/10/30` for SEO pages unless there is a measured business need.
- Be extra careful with dynamic routes such as `/[slug]`, `/blog/[slug]`, `/[...slug]`, and locale-expanded variants because each path can generate separate ISR writes.
- Before deployment, inspect any use of `res.revalidate()`, `revalidatePath()`, `revalidateTag()`, and route-level `revalidate` values.
- Prefer `dryRun` support and request logging for revalidation endpoints so path fan-out is visible before cache writes happen.

## Configuration System

### Primary Configuration
- **`blog.config.js`** - Main configuration file that imports modular configs
- **Environment Variables** - Deployed via Vercel environment variables
- **Theme Configs** - Each theme has its own `config.js` for theme-specific settings

### Dynamic Configuration
- Runtime theme switching supported
- Multi-language configuration through Notion page IDs
- Feature toggles for analytics, comments, search, etc.

## Development Guidelines

### Working with Themes
1. Current theme components are in `/themes/[THEME]/components/`
2. Shared components are in `/components/`
3. Use the theme alias `@theme-components` for imports (configured via webpack)
4. Each theme implements standard layout interfaces (LayoutIndex, LayoutSlug, etc.)
5. Theme switching: Change `THEME` in `blog.config.js` or use environment variable `NEXT_PUBLIC_THEME`

### Adding New Features
1. Add shared logic to `/lib/`
2. Add shared components to `/components/`
3. Update theme components as needed
4. Add configuration to appropriate `/conf/` file
5. Use TypeScript for new files when appropriate (`.ts`/`.tsx`)

### Code Style & Standards
- **Mixed JavaScript/TypeScript**: Project supports both `.js` and `.ts`/`.tsx` files
- **ESLint Rules**: Less strict TypeScript checking for `.js` files
- **Notion API**: Some files use TypeScript (`CustomNotionApi.ts`)
- **Webpack Aliases**: Use `@` for root imports, `@theme-components` for current theme

### Naming Conventions
- **Components**: PascalCase (e.g., `LazyImage`)
- **Files**: kebab-case (e.g., `lazy-image.js`)
- **Variables/Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Commit Message Standards
Follow Conventional Commits format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code formatting (no functional changes)
- `refactor`: Code restructuring
- `test`: Test-related changes
- `chore`: Build tools or auxiliary changes
- `perf`: Performance optimization
- `ci`: CI configuration changes
- `build`: Build system or dependency changes
- `revert`: Revert previous commits

**Examples**:
```
feat(auth): add user authentication
fix(ui): resolve button alignment issue
docs: update installation guide
```

### Notion Content Structure
- The system expects specific Notion database properties
- Custom properties can be configured in `/conf/notion.config.js`
- Content is transformed and cached for optimal performance

### Internationalization
- Add new languages to `/lib/lang/[locale].js`
- Configure Notion page IDs for each language in `blog.config.js`
- URL structure: `/[locale]/[path]` for multi-language support

## Environment Variables

Environment variables can be configured in three ways:
1. **`.env.local`** - Local development (not committed to git)
2. **`blog.config.js`** - Default values with `process.env.NEXT_PUBLIC_*` fallbacks
3. **Vercel Environment Variables** - Production deployment

### Critical Environment Variables
- `NOTION_PAGE_ID` - Your Notion database ID (required)
  - **Single language format**: `NOTION_PAGE_ID=097e5f674880459d8e1b4407758dc4fb`
  - **Multi-language format (recommended)**: `NOTION_PAGE_ID=中文数据库ID,en:英文数据库ID`
  - **Example**: `NOTION_PAGE_ID=2a2f7026d6674bd19c5aec3c94bfd453,en:13e00092b9778002a3e2d5278bab3cd9`
  - **Access**: `yoursite.com/` (default language), `yoursite.com/en/` (English)
- `NEXT_PUBLIC_THEME` - Current theme name (default: 'simple')
- `NEXT_PUBLIC_LANG` - Default language (default: 'zh-CN')

### Build-Time Environment Variables
- `EXPORT=true` - Enables static export mode (used by `npm run export`)
- `ANALYZE=true` - Enables bundle analysis (used by `npm run bundle-report`)
- `VERCEL_ENV=production` - Simulates production build locally
- `NEXT_BUILD_STANDALONE=true` - Generates standalone build output

See `.env.example` for a complete list of available environment variables.

### Third-Party Service Integration

#### Algolia Full-Text Search (Optional)
Free tier: 10,000 searches/month, 10,000 records
```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_APP_KEY=your_admin_key  # Server-side only, keep secret
NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_APP_KEY=your_search_only_key
NEXT_PUBLIC_ALGOLIA_INDEX=your_index_name
```

#### Chatbase AI Chatbot (Optional)
Free tier: 20 messages/month, 1 chatbot, 400,000 characters/bot
```bash
NEXT_PUBLIC_CHATBASE_ID=your_chatbase_id  # Get from chatbase.co "Embed on site"
```

## Next.js Configuration Details

### Build Output Modes
The project supports three build output modes via `next.config.js`:
1. **Standard (SSR/SSG)**: Default mode with server-side rendering
2. **Export (Static)**: `EXPORT=true` - Fully static site export
3. **Standalone**: `NEXT_BUILD_STANDALONE=true` - Self-contained deployment bundle

### Key Next.js Settings
- **Static Generation Timeout**: 120 seconds (`staticPageGenerationTimeout`)
- **i18n**: Automatically configured based on `NOTION_PAGE_ID` language prefixes
  - Disabled when `EXPORT=true` (static export doesn't support i18n)
- **Image Optimization**: Configured for AVIF/WebP formats
  - Allowed domains: gravatar.com, notion.so, github, unsplash, etc.
  - Add new image domains to `next.config.js` (next.config.js:105-114)
- **URL Rewrites**:
  - Multi-language support: `/:locale(zh|en)/:path*` → `/:path*`
  - Pseudo-static URLs: `/:path*.html` → `/:path*`
- **Webpack Aliases**:
  - `@` → Project root directory
  - `@theme-components` → Current theme directory (dynamically set)

## Notion Database Setup

### Required Notion Properties
The system expects the following properties in your Notion database (configurable in `/conf/notion.config.js`):
- **Title** - Post title
- **Status** - Publication status (Published/Draft/Invisible)
- **Type** - Content type (Post/Page/Notice/Menu/SubMenu)
- **Slug** - URL slug (optional, auto-generated from title if not set)
- **Date** - Publication date
- **Category** - Single select for post category
- **Tags** - Multi-select for post tags
- **Summary** - Post excerpt/description
- **Password** - Password protection (optional)
- **Icon** - Post icon (optional)

### Setting Up Your Notion Database
1. Duplicate the template: https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
2. Copy your database ID from the URL
3. Set `NOTION_PAGE_ID` in `.env.local` or `blog.config.js`
4. Grant integration access to your Notion page

## Debugging & Troubleshooting

### Common Issues
1. **Build fails with sitemap errors**: The build process automatically removes conflicting sitemap files (next.config.js:38-55)
2. **Theme not loading**: Verify `THEME` value matches a directory name in `/themes/`
3. **Images not loading**: Add the image domain to `next.config.js` image domains
4. **Notion data not updating**: Check `NEXT_REVALIDATE_SECOND` (default: 5 seconds)
5. **TypeScript errors during build**: ESLint ignores errors during builds (`ignoreDuringBuilds: true`)

### Debug Mode
Enable debug logging by setting in `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
```

### Cache Management
The caching system has three layers:
1. **Memory cache** - In-memory (fastest, cleared on restart)
2. **File cache** - Filesystem-based
3. **Redis cache** - Optional, for distributed deployments

To disable caching during development, set in `/conf/dev.config.js`:
```javascript
ENABLE_CACHE: false
```

## Project File Structure Reference

```
CharliiAI/
├── blog.config.js          # Main configuration (imports all conf/*.config.js)
├── next.config.js          # Next.js configuration with theme aliasing
├── package.json            # Dependencies and npm scripts
├── /components/            # Shared React components
├── /conf/                  # Modular configuration files
├── /lib/                   # Core business logic
│   ├── /cache/            # Multi-layer caching
│   ├── /db/               # Database operations
│   ├── /lang/             # i18n translations
│   ├── /notion/           # Notion API integration
│   ├── /plugins/          # Third-party integrations
│   └── /utils/            # Helper utilities
├── /pages/                 # Next.js routing
├── /public/                # Static assets
├── /scripts/               # Development scripts
├── /styles/                # Global styles
├── /themes/                # Theme implementations
│   ├── /simple/           # Simple theme (default)
│   ├── /hexo/             # Hexo-style theme
│   ├── /medium/           # Medium-style theme
│   └── /[theme-name]/     # Other themes
└── /types/                 # TypeScript type definitions
```

#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const ROOT = path.resolve(__dirname, '../..')
const API_BASE = 'https://api.notion.com/v1'
const DEFAULT_PROTOCOL_VERSION = '2025-06-18'
const DEFAULT_NOTION_VERSION = '2026-03-11'
const OPS_COOKIE_NAME = 'notionnext_ops_session'
// Fixed salt for deriving the ops cookie token with scrypt. The receiving
// revalidate endpoint must derive the same token to accept the request.
const OPS_COOKIE_SALT = 'notionnext-content-mcp/ops-cookie/v1'
const NOTIONNEXT_WRITE_CONTRACT_ERROR =
  'NotionNext-native writing contract: never write ext. Put structured metadata in first-class Notion properties, long-form content in page blocks via bodyMarkdown, and artwork in the native Page Cover.'

for (const envFile of getEnvFileCandidates()) {
  loadEnvFile(envFile)
}

const commonFieldNames = {
  title: env('NOTION_CONTENT_PROP_TITLE', 'NEXT_PUBLIC_NOTION_PROPERTY_TITLE', 'title'),
  type: env('NOTION_CONTENT_PROP_TYPE', 'NEXT_PUBLIC_NOTION_PROPERTY_TYPE', 'type'),
  status: env('NOTION_CONTENT_PROP_STATUS', 'NEXT_PUBLIC_NOTION_PROPERTY_STATUS', 'status'),
  slug: env('NOTION_CONTENT_PROP_SLUG', 'NEXT_PUBLIC_NOTION_PROPERTY_SLUG', 'slug'),
  summary: env('NOTION_CONTENT_PROP_SUMMARY', 'NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY', 'summary'),
  category: env('NOTION_CONTENT_PROP_CATEGORY', 'NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY', 'category'),
  tags: env('NOTION_CONTENT_PROP_TAGS', 'NEXT_PUBLIC_NOTION_PROPERTY_TAGS', 'tags'),
  date: env('NOTION_CONTENT_PROP_DATE', 'NEXT_PUBLIC_NOTION_PROPERTY_DATE', 'date')
}

const legacyExtFieldName = env(
  'NOTION_CONTENT_PROP_EXT',
  'NEXT_PUBLIC_NOTION_PROPERTY_EXT',
  'ext'
)

const contentTypeValues = {
  Post: env('NOTION_POSTS_TYPE_VALUE', 'NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST', 'Post'),
  Page: env('NOTION_PAGES_TYPE_VALUE', 'NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE', 'Page'),
  Record: env('NOTION_RECORDS_TYPE_VALUE', 'Record'),
  Event: env('NOTION_EVENTS_TYPE_VALUE', 'NEXT_PUBLIC_NOTION_PROPERTY_TYPE_EVENT', 'Event'),
  Member: env('NOTION_MEMBERS_TYPE_VALUE', 'NEXT_PUBLIC_NOTION_PROPERTY_TYPE_MEMBER', 'Member')
}

const defaultStatus = env(
  'NOTION_CONTENT_STATUS_DRAFT_VALUE',
  'NOTION_MEMBERS_STATUS_DRAFT_VALUE',
  'NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE',
  'Invisible'
)

const publishedStatus = env(
  'NOTION_CONTENT_STATUS_PUBLISHED_VALUE',
  'NOTION_MEMBERS_STATUS_PUBLISHED_VALUE',
  'NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH',
  'Published'
)

const tools = [
  {
    name: 'notionnext_status',
    description: 'Check the NotionNext Notion publishing configuration without exposing secrets.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'build_notion_draft',
    description: 'Turn NotionNext website content into a Notion page payload preview. Never write ext: use first-class properties, page blocks, and the native Page Cover. This does not write to Notion.',
    inputSchema: {
      type: 'object',
      required: ['contentType', 'title'],
      properties: {
        contentType: {
          type: 'string',
          enum: ['Post', 'Page', 'Record', 'Event', 'Member']
        },
        title: { type: 'string' },
        slug: { type: 'string' },
        status: { type: 'string' },
        summary: { type: 'string' },
        category: { type: 'string' },
        tags: {
          oneOf: [
            { type: 'array', items: { type: 'string' } },
            { type: 'string' }
          ]
        },
        date: { type: 'string' },
        cover: { type: 'string' },
        icon: { type: 'string' },
        bodyMarkdown: { type: 'string' },
        dataSourceId: { type: 'string' },
        record: {
          type: 'object',
          additionalProperties: false,
          properties: {
            location: { type: 'string' },
            related_event_slug: { type: 'string' }
          }
        },
        member: {
          type: 'object',
          additionalProperties: true,
          properties: {
            avatar: { type: 'string' },
            role: { type: 'string' },
            bio: { type: 'string' },
            quote: { type: 'string' },
            featured: { type: 'boolean' },
            verified: { type: 'boolean' },
            website: { type: 'string' },
            social_github: { type: 'string' },
            social_x: { type: 'string' },
            social_linkedin: { type: 'string' }
          }
        },
        event: {
          type: 'object',
          additionalProperties: false,
          properties: {
            event_start: { type: 'string' },
            event_end: { type: 'string' },
            location: { type: 'string' },
            organizer_slugs: {
              oneOf: [
                { type: 'array', items: { type: 'string' } },
                { type: 'string' }
              ]
            },
            website: { type: 'string' },
            registration_qr: { type: 'string' },
            event_status: { type: 'string' },
            event_format: { type: 'string' },
            public_listing: { type: 'boolean' },
            cover_position: { type: 'string' }
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'create_notion_draft',
    description: 'Create an NotionNext Notion draft page. Never write ext: use first-class properties, page blocks, and the native Page Cover. The default status is Invisible, not Published.',
    inputSchema: {
      type: 'object',
      required: ['contentType', 'title'],
      properties: {
        contentType: {
          type: 'string',
          enum: ['Post', 'Page', 'Record', 'Event', 'Member']
        },
        title: { type: 'string' },
        slug: { type: 'string' },
        status: { type: 'string' },
        summary: { type: 'string' },
        category: { type: 'string' },
        tags: {
          oneOf: [
            { type: 'array', items: { type: 'string' } },
            { type: 'string' }
          ]
        },
        date: { type: 'string' },
        cover: { type: 'string' },
        icon: { type: 'string' },
        bodyMarkdown: { type: 'string' },
        dataSourceId: { type: 'string' },
        member: { type: 'object', additionalProperties: true },
        event: {
          type: 'object',
          additionalProperties: false,
          properties: {
            event_start: { type: 'string' },
            event_end: { type: 'string' },
            location: { type: 'string' },
            organizer_slugs: {
              oneOf: [
                { type: 'array', items: { type: 'string' } },
                { type: 'string' }
              ]
            },
            website: { type: 'string' },
            registration_qr: { type: 'string' },
            event_status: { type: 'string' },
            event_format: { type: 'string' },
            public_listing: { type: 'boolean' },
            cover_position: { type: 'string' }
          }
        },
        record: {
          type: 'object',
          additionalProperties: false,
          properties: {
            location: { type: 'string' },
            related_event_slug: { type: 'string' }
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'inspect_notion_data_source',
    description: 'Read the schema for an allowed NotionNext Notion data source.',
    inputSchema: {
      type: 'object',
      properties: {
        contentType: {
          type: 'string',
          enum: ['Post', 'Page', 'Record', 'Event', 'Member']
        },
        dataSourceId: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'query_notion_pages',
    description: 'Query pages from an allowed NotionNext Notion data source and return safe property values.',
    inputSchema: {
      type: 'object',
      properties: {
        contentType: {
          type: 'string',
          enum: ['Post', 'Page', 'Record', 'Event', 'Member']
        },
        dataSourceId: { type: 'string' },
        status: { type: 'string' },
        search: { type: 'string' },
        pageSize: { type: 'number' },
        startCursor: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'get_notion_page',
    description: 'Read one allowed Notion page, optionally including its first-level child blocks.',
    inputSchema: {
      type: 'object',
      required: ['pageId'],
      properties: {
        pageId: { type: 'string' },
        includeBlocks: { type: 'boolean' },
        blockPageSize: { type: 'number' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'update_notion_page',
    description: 'Update first-class properties, native cover, or icon for an allowed Notion page. Never write ext.',
    inputSchema: {
      type: 'object',
      required: ['pageId', 'fields'],
      properties: {
        pageId: { type: 'string' },
        contentType: {
          type: 'string',
          enum: ['Post', 'Page', 'Record', 'Event', 'Member']
        },
        dataSourceId: { type: 'string' },
        fields: { type: 'object', additionalProperties: true }
      },
      additionalProperties: false
    }
  },
  {
    name: 'append_notion_blocks',
    description: 'Append Markdown-converted blocks to an allowed Notion page.',
    inputSchema: {
      type: 'object',
      required: ['pageId', 'bodyMarkdown'],
      properties: {
        pageId: { type: 'string' },
        bodyMarkdown: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'archive_notion_page',
    description: 'Archive or restore an allowed Notion page.',
    inputSchema: {
      type: 'object',
      required: ['pageId'],
      properties: {
        pageId: { type: 'string' },
        archived: { type: 'boolean' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'refresh_site_cache',
    description: 'Refresh the NotionNext frontend cache through the existing ops-protected revalidate API.',
    inputSchema: {
      type: 'object',
      properties: {
        eventSlug: { type: 'string' }
      },
      additionalProperties: false
    }
  }
]

const resources = [
  {
    uri: 'notionnext://status/config',
    name: 'NotionNext content pipeline status',
    mimeType: 'application/json',
    description: 'Safe configuration status for the Notion writing layer.'
  },
  {
    uri: 'notionnext://schemas/content',
    name: 'NotionNext Notion content schema',
    mimeType: 'text/markdown',
    description: 'Content types and fields expected by the website.'
  },
  {
    uri: 'notionnext://guides/workflow',
    name: 'NotionNext content publishing workflow',
    mimeType: 'text/markdown',
    description: 'Draft, review, publish, and cache refresh workflow.'
  }
]

const prompts = [
  {
    name: 'notionnext-content-brief',
    description: 'Draft content copy for a NotionNext site (blog post, page, event, record, or member profile).',
    arguments: [
      {
        name: 'contentType',
        description: 'Post, Event, Record, Member, or Page',
        required: true
      },
      {
        name: 'goal',
        description: 'What this content should prove or help users do',
        required: true
      }
    ]
  },
  {
    name: 'notionnext-draft-payload',
    description: 'Convert approved copy into a Notion draft payload.',
    arguments: [
      {
        name: 'contentType',
        description: 'Post, Event, Record, Member, or Page',
        required: true
      }
    ]
  }
]

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue

    const key = trimmed.slice(0, index).trim()
    if (!key || process.env[key]) continue

    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function getEnvFileCandidates() {
  const candidates = [
    path.join(ROOT, '.env.local'),
    path.join(ROOT, '.env'),
    path.join(ROOT, '.env.mcp.local'),
    path.join(ROOT, '.env.notion.local'),
    path.join(ROOT, '.env.vercel.local'),
    path.join(ROOT, '.env.vercel.production.local'),
    path.join(ROOT, '.env.vercel.preview.local')
  ]

  const explicitFiles = []
  const envFileFromEnv = process.env.NOTIONNEXT_MCP_ENV_FILE || process.env.MCP_ENV_FILE || ''
  if (envFileFromEnv) {
    explicitFiles.push(...envFileFromEnv.split(path.delimiter))
  }

  for (let index = 2; index < process.argv.length; index += 1) {
    const arg = process.argv[index]
    if (arg === '--env-file' && process.argv[index + 1]) {
      explicitFiles.push(process.argv[index + 1])
      index += 1
    } else if (arg.startsWith('--env-file=')) {
      explicitFiles.push(arg.slice('--env-file='.length))
    }
  }

  for (const file of explicitFiles) {
    const clean = String(file || '').trim()
    if (!clean) continue
    candidates.push(path.isAbsolute(clean) ? clean : path.join(ROOT, clean))
  }

  return [...new Set(candidates)]
}

function env(...keysAndFallback) {
  const fallback = keysAndFallback[keysAndFallback.length - 1]
  const keys = keysAndFallback.slice(0, -1)
  for (const key of keys) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return fallback
}

function mask(value) {
  if (!value) return ''
  const clean = String(value)
  if (clean.length <= 8) return '<set>'
  return `${clean.slice(0, 4)}...${clean.slice(-4)}`
}

function hasEnv(key) {
  return Boolean(process.env[key]?.trim())
}

function allowUnlistedDataSource() {
  return process.env.NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE === 'true'
}

function configuredDataSourceIds() {
  const keys = [
    'NOTION_CONTENT_DATA_SOURCE_ID',
    'NOTION_POSTS_DATA_SOURCE_ID',
    'NOTION_PAGES_DATA_SOURCE_ID',
    'NOTION_RECORDS_DATA_SOURCE_ID',
    'NOTION_MEMBERS_DATA_SOURCE_ID',
    'NOTION_EVENTS_DATA_SOURCE_ID'
  ]

  return new Set(keys.map(key => process.env[key]?.trim()).filter(Boolean))
}

function assertDataSourceAllowed(dataSourceId) {
  if (!dataSourceId || allowUnlistedDataSource()) return
  const allowed = configuredDataSourceIds()
  if (allowed.has(dataSourceId)) return

  throw new Error(
    'Data source is not in the NotionNext MCP allow-list. Configure its env var or set NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE=true.'
  )
}

function getNotionToken() {
  return process.env.NOTION_API_TOKEN?.trim() || process.env.NOTION_ACCESS_TOKEN?.trim() || ''
}

function getNotionVersion() {
  return process.env.NOTION_API_VERSION?.trim() || DEFAULT_NOTION_VERSION
}

function splitList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  return value
    .split(/[,，、\n]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function cleanString(value, max = 2000) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function safeSlug(value, fallbackTitle, contentType) {
  const raw = cleanString(value, 240).replace(/^\/+|\/+$/g, '')
  if (raw && !/^https?:\/\//i.test(raw)) {
    if (contentType === 'Event') return raw.replace(/^events\//, '')
    if (contentType === 'Member') {
      const terminal = raw.split('/').filter(Boolean).pop()
      return `members/${terminal || slugify(fallbackTitle, 'member')}`
    }
    return raw
  }

  const base = slugify(fallbackTitle, contentType.toLowerCase())
  if (contentType === 'Member') return `members/${base}`
  return base
}

function slugify(value, fallback = 'draft') {
  const ascii = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii || `${fallback}-${Date.now()}`
}

function cleanUrl(value) {
  const input = cleanString(value, 2048)
  if (!input) return ''
  if (/^https?:\/\//i.test(input) || /^mailto:/i.test(input)) return input
  return `https://${input}`
}

function cleanDate(value) {
  const input = cleanString(value, 80)
  if (!input) return ''
  return input
}

function normalizeFieldName(value) {
  return String(value || '').trim().toLowerCase()
}

function isLegacyExtField(value) {
  const normalized = normalizeFieldName(value)
  return normalized === 'ext' || normalized === normalizeFieldName(legacyExtFieldName)
}

function assertNoExtAnywhere(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return
  seen.add(value)

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isLegacyExtField(key)) throw new Error(NOTIONNEXT_WRITE_CONTRACT_ERROR)
    assertNoExtAnywhere(nestedValue, seen)
  }
}

function richTextParts(value) {
  const text = String(value ?? '')
  if (!text) return []
  const parts = []
  for (let index = 0; index < text.length; index += 1900) {
    parts.push({
      type: 'text',
      text: {
        content: text.slice(index, index + 1900)
      }
    })
  }
  return parts
}

function normalizeDraftInput(input = {}) {
  assertNoExtAnywhere(input)

  const contentType = cleanString(input.contentType, 40)
  if (!contentTypeValues[contentType]) {
    throw new Error(`Unsupported contentType: ${contentType || '<empty>'}`)
  }

  const title = cleanString(input.title, 240)
  if (!title) throw new Error('title is required')

  const status = cleanString(input.status, 80) || defaultStatus

  const event = input.event && typeof input.event === 'object' && !Array.isArray(input.event)
    ? input.event
    : {}
  const member = input.member && typeof input.member === 'object' && !Array.isArray(input.member)
    ? input.member
    : {}
  const record = input.record && typeof input.record === 'object' && !Array.isArray(input.record)
    ? input.record
    : {}

  return {
    contentType,
    title,
    slug: safeSlug(input.slug, title, contentType),
    status,
    summary: cleanString(input.summary, 1800),
    category: cleanString(input.category, 160),
    tags: splitList(input.tags),
    date: cleanDate(input.date),
    cover: cleanUrl(input.cover),
    icon: cleanString(input.icon, 256),
    bodyMarkdown: cleanString(input.bodyMarkdown, 60000),
    dataSourceId: cleanString(input.dataSourceId, 160),
    event: {
      event_start: cleanDate(event.event_start),
      event_end: cleanDate(event.event_end),
      location: cleanString(event.location, 240),
      organizer_slugs: splitList(event.organizer_slugs),
      website: cleanUrl(event.website),
      registration_qr: cleanUrl(event.registration_qr),
      event_status: cleanString(event.event_status, 80),
      event_format: cleanString(event.event_format, 80),
      public_listing: typeof event.public_listing === 'boolean' ? event.public_listing : undefined,
      cover_position: cleanString(event.cover_position, 80)
    },
    record: {
      location: cleanString(record.location, 240),
      related_event_slug: cleanString(record.related_event_slug, 240)
    },
    member: {
      avatar: cleanUrl(member.avatar),
      role: cleanString(member.role, 240),
      bio: cleanString(member.bio, 1800),
      quote: cleanString(member.quote, 800),
      featured: typeof member.featured === 'boolean' ? member.featured : undefined,
      verified: typeof member.verified === 'boolean' ? member.verified : undefined,
      website: cleanUrl(member.website),
      social_github: cleanUrl(member.social_github),
      social_x: cleanUrl(member.social_x),
      social_linkedin: cleanUrl(member.social_linkedin)
    }
  }
}

function dataSourceCandidates(contentType) {
  const candidates = {
    Post: ['NOTION_POSTS_DATA_SOURCE_ID', 'NOTION_CONTENT_DATA_SOURCE_ID'],
    Page: ['NOTION_PAGES_DATA_SOURCE_ID', 'NOTION_CONTENT_DATA_SOURCE_ID'],
    Record: ['NOTION_RECORDS_DATA_SOURCE_ID', 'NOTION_CONTENT_DATA_SOURCE_ID'],
    Event: ['NOTION_EVENTS_DATA_SOURCE_ID', 'NOTION_MEMBERS_DATA_SOURCE_ID'],
    Member: ['NOTION_MEMBERS_DATA_SOURCE_ID']
  }
  return candidates[contentType] || []
}

function resolveDataSource(contentType, explicitId = '') {
  if (explicitId) {
    return {
      id: explicitId,
      source: 'argument:dataSourceId',
      candidates: []
    }
  }

  const candidates = dataSourceCandidates(contentType)
  for (const key of candidates) {
    const value = process.env[key]?.trim()
    if (value) {
      return { id: value, source: `env:${key}`, candidates }
    }
  }

  return { id: '', source: '', candidates }
}

function memberFieldNames() {
  return {
    avatar: env('NOTION_MEMBERS_PROP_AVATAR', 'avatar'),
    role: env('NOTION_MEMBERS_PROP_ROLE', 'role'),
    bio: env('NOTION_MEMBERS_PROP_BIO', 'bio'),
    quote: env('NOTION_MEMBERS_PROP_QUOTE', 'quote'),
    featured: env('NOTION_MEMBERS_PROP_FEATURED', 'featured'),
    verified: env('NOTION_MEMBERS_PROP_VERIFIED', 'verified'),
    website: env('NOTION_MEMBERS_PROP_WEBSITE', 'website'),
    social_github: env('NOTION_MEMBERS_PROP_SOCIAL_GITHUB', 'social_github'),
    social_x: env('NOTION_MEMBERS_PROP_SOCIAL_X', 'social_x'),
    social_linkedin: env('NOTION_MEMBERS_PROP_SOCIAL_LINKEDIN', 'social_linkedin')
  }
}

function eventFieldNames() {
  return {
    event_start: env('NOTION_EVENTS_PROP_EVENT_START', 'event_start'),
    event_end: env('NOTION_EVENTS_PROP_EVENT_END', 'event_end'),
    location: env('NOTION_EVENTS_PROP_LOCATION', 'location'),
    organizer_slugs: env('NOTION_EVENTS_PROP_ORGANIZER_SLUGS', 'organizer_slugs'),
    website: env('NOTION_EVENTS_PROP_WEBSITE', 'website'),
    registration_qr: env('NOTION_EVENTS_PROP_REGISTRATION_QR', 'registration_qr'),
    event_status: env('NOTION_EVENTS_PROP_EVENT_STATUS', 'event_status'),
    event_format: env('NOTION_EVENTS_PROP_EVENT_FORMAT', 'event_format'),
    public_listing: env('NOTION_EVENTS_PROP_PUBLIC_LISTING', 'public_listing'),
    cover_position: env('NOTION_EVENTS_PROP_COVER_POSITION', 'cover_position')
  }
}

function recordFieldNames() {
  return {
    location: env('NOTION_RECORDS_PROP_LOCATION', 'location'),
    related_event_slug: env('NOTION_RECORDS_PROP_RELATED_EVENT_SLUG', 'related_event_slug')
  }
}

function logicalFields(draft) {
  const fields = {
    title: draft.title,
    type: contentTypeValues[draft.contentType],
    status: draft.status,
    slug: draft.slug,
    summary: draft.summary,
    category: draft.category,
    tags: draft.tags,
    date: draft.date
  }

  if (draft.contentType === 'Event') {
    const names = eventFieldNames()
    fields[names.event_start] = draft.event.event_start || draft.date
    fields[names.event_end] = draft.event.event_end
    fields[names.location] = draft.event.location
    fields[names.organizer_slugs] = draft.event.organizer_slugs
    fields[names.website] = draft.event.website
    fields[names.registration_qr] = draft.event.registration_qr
    fields[names.event_status] = draft.event.event_status
    fields[names.event_format] = draft.event.event_format
    fields[names.public_listing] = draft.event.public_listing
    fields[names.cover_position] = draft.event.cover_position
  }

  if (draft.contentType === 'Record') {
    const names = recordFieldNames()
    fields[names.location] = draft.record.location
    fields[names.related_event_slug] = draft.record.related_event_slug
  }

  if (draft.contentType === 'Member') {
    const names = memberFieldNames()
    for (const [key, fieldName] of Object.entries(names)) {
      fields[fieldName] = draft.member[key]
    }
  }

  return removeEmpty(fields)
}

function removeEmpty(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === undefined || value === null) return false
      if (typeof value === 'string') return value.trim() !== ''
      if (Array.isArray(value)) return value.length > 0
      return true
    })
  )
}

function findPropertyKey(dataSource, candidates = []) {
  for (const candidate of candidates) {
    if (!candidate) continue
    if (dataSource?.properties?.[candidate]) return candidate

    const lower = candidate.toLowerCase()
    if (dataSource?.properties?.[lower]) return lower

    for (const [key, schema] of Object.entries(dataSource?.properties || {})) {
      if (schema?.name?.toLowerCase() === lower) return key
    }
  }
  return ''
}

function buildPropertyBySchema(schema, value) {
  if (value === undefined || value === null) return null
  if (typeof value === 'string' && !value.trim()) return null
  if (Array.isArray(value) && value.length === 0) return null

  switch (schema.type) {
    case 'title':
      return { title: richTextParts(value) }
    case 'rich_text':
      return { rich_text: richTextParts(value) }
    case 'url':
      return { url: cleanUrl(value) || null }
    case 'select':
      return { select: { name: String(value) } }
    case 'status':
      return { status: { name: String(value) } }
    case 'multi_select':
      return { multi_select: splitList(value).map(name => ({ name })) }
    case 'date': {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const start = cleanDate(value.start || value.start_date)
        if (!start) return null
        const date = { start }
        const end = cleanDate(value.end || value.end_date)
        if (end) date.end = end
        if (value.time_zone) date.time_zone = String(value.time_zone)
        return { date }
      }
      const start = cleanDate(value)
      return start ? { date: { start } } : null
    }
    case 'checkbox':
      return { checkbox: Boolean(value) }
    case 'number': {
      const number = Number(value)
      return Number.isFinite(number) ? { number } : null
    }
    default:
      return null
  }
}

function propertyCandidatesFor(logicalName, fieldName, contentType) {
  const candidates = [fieldName]
  if (commonFieldNames[logicalName]) candidates.push(commonFieldNames[logicalName])

  const envSuffix = String(logicalName)
    .replace(/[A-Z]/g, letter => `_${letter}`)
    .toUpperCase()
  if (contentType === 'Event') {
    candidates.push(process.env[`NOTION_EVENTS_PROP_${envSuffix}`])
  }
  if (contentType === 'Member') {
    candidates.push(process.env[`NOTION_MEMBERS_PROP_${envSuffix}`])
  }
  if (contentType === 'Record') {
    candidates.push(process.env[`NOTION_RECORDS_PROP_${envSuffix}`])
  }

  if (contentType === 'Member') {
    const memberNames = memberFieldNames()
    if (memberNames[logicalName]) candidates.push(memberNames[logicalName])
  }

  if (contentType === 'Event') {
    const eventNames = eventFieldNames()
    if (eventNames[logicalName]) candidates.push(eventNames[logicalName])
  }

  if (contentType === 'Record') {
    const recordNames = recordFieldNames()
    if (recordNames[logicalName]) candidates.push(recordNames[logicalName])
  }

  return [...new Set(candidates.filter(Boolean))]
}

function buildPropertiesFromSchema(draft, dataSource) {
  const properties = {}
  const warnings = []
  const fields = logicalFields(draft)
  const logicalNameByField = new Map(
    Object.entries(commonFieldNames).map(([logicalName, fieldName]) => [fieldName, logicalName])
  )

  for (const [fieldName, value] of Object.entries(fields)) {
    const logicalName = logicalNameByField.get(fieldName) || fieldName
    const key = findPropertyKey(
      dataSource,
      propertyCandidatesFor(logicalName, fieldName, draft.contentType)
    )
    if (!key) {
      warnings.push(`Missing Notion property for ${fieldName}`)
      continue
    }

    const schema = dataSource.properties[key]
    const payload = buildPropertyBySchema(schema, value)
    if (!payload) {
      warnings.push(`Unsupported or empty property payload for ${fieldName} (${schema.type})`)
      continue
    }

    properties[key] = payload
  }

  return { properties, warnings }
}

function buildPreviewProperties(draft) {
  return logicalFields(draft)
}

function externalMedia(value) {
  const url = cleanUrl(value)
  return url ? { type: 'external', external: { url } } : null
}

function iconPayload(value) {
  const input = cleanString(value, 256)
  if (!input) return null
  if (/^https?:\/\//i.test(input)) return externalMedia(input)
  if (input.length <= 8) return { type: 'emoji', emoji: input }
  return null
}

function markdownToBlocks(markdown) {
  const blocks = []
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
  let paragraph = []
  let code = null

  function flushParagraph() {
    const text = paragraph.join('\n').trim()
    paragraph = []
    if (!text) return
    for (const chunk of splitLongText(text, 1800)) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: richTextParts(chunk) }
      })
    }
  }

  for (const line of lines) {
    const fence = line.match(/^```(\w+)?\s*$/)
    if (fence) {
      if (code) {
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: richTextParts(code.lines.join('\n').slice(0, 1900)),
            language: code.language || 'plain text'
          }
        })
        code = null
      } else {
        flushParagraph()
        code = { language: fence[1] || 'plain text', lines: [] }
      }
      continue
    }

    if (code) {
      code.lines.push(line)
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      const type = `heading_${heading[1].length}`
      blocks.push({
        object: 'block',
        type,
        [type]: { rich_text: richTextParts(heading[2].trim().slice(0, 1900)) }
      })
      continue
    }

    const bullet = line.match(/^\s*[-*]\s+(.+)$/)
    if (bullet) {
      flushParagraph()
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richTextParts(bullet[1].trim().slice(0, 1900)) }
      })
      continue
    }

    const numbered = line.match(/^\s*\d+\.\s+(.+)$/)
    if (numbered) {
      flushParagraph()
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richTextParts(numbered[1].trim().slice(0, 1900)) }
      })
      continue
    }

    const quote = line.match(/^>\s+(.+)$/)
    if (quote) {
      flushParagraph()
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: richTextParts(quote[1].trim().slice(0, 1900)) }
      })
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  return blocks.slice(0, 90)
}

function splitLongText(text, size) {
  const output = []
  for (let index = 0; index < text.length; index += size) {
    output.push(text.slice(index, index + size))
  }
  return output
}

async function notionRequest(requestPath, options = {}) {
  const token = getNotionToken()
  if (!token) throw new Error('NOTION_API_TOKEN is not configured')

  const response = await fetch(`${API_BASE}${requestPath}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': getNotionVersion(),
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) {
    throw new Error(`Notion API failed ${response.status}: ${JSON.stringify(data).slice(0, 700)}`)
  }
  return data
}

async function getDataSource(dataSourceId) {
  assertDataSourceAllowed(dataSourceId)
  return notionRequest(`/data_sources/${dataSourceId}`)
}

function readNotionPropertyValue(property) {
  if (!property || typeof property !== 'object') return null

  switch (property.type) {
    case 'title':
      return (property.title || []).map(item => item.plain_text || '').join('')
    case 'rich_text':
      return (property.rich_text || []).map(item => item.plain_text || '').join('')
    case 'url':
      return property.url || ''
    case 'email':
      return property.email || ''
    case 'phone_number':
      return property.phone_number || ''
    case 'select':
      return property.select?.name || ''
    case 'status':
      return property.status?.name || ''
    case 'multi_select':
      return (property.multi_select || []).map(item => item.name).filter(Boolean)
    case 'date':
      return property.date || null
    case 'checkbox':
      return property.checkbox === true
    case 'number':
      return property.number
    case 'relation':
      return (property.relation || []).map(item => item.id)
    case 'people':
      return (property.people || []).map(item => ({
        id: item.id,
        name: item.name || ''
      }))
    case 'files':
      return (property.files || []).map(file => ({
        name: file.name || '',
        type: file.type,
        url: file.type === 'external' ? file.external?.url : file.file?.url
      }))
    case 'formula':
      return readFormulaValue(property.formula)
    case 'rollup':
      return property.rollup || null
    case 'created_time':
      return property.created_time || ''
    case 'last_edited_time':
      return property.last_edited_time || ''
    case 'created_by':
      return property.created_by?.id || ''
    case 'last_edited_by':
      return property.last_edited_by?.id || ''
    default:
      return property[property.type] ?? null
  }
}

function readFormulaValue(formula) {
  if (!formula || typeof formula !== 'object') return null
  if (formula.type === 'string') return formula.string || ''
  if (formula.type === 'number') return formula.number
  if (formula.type === 'boolean') return formula.boolean
  if (formula.type === 'date') return formula.date || null
  return null
}

function simplifyPage(page) {
  const properties = {}
  for (const [key, property] of Object.entries(page?.properties || {})) {
    properties[key] = readNotionPropertyValue(property)
  }

  return {
    id: page.id,
    url: page.url,
    archived: page.archived === true,
    inTrash: page.in_trash === true,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    parent: {
      type: page.parent?.type,
      dataSourceId: page.parent?.data_source_id || page.parent?.database_id || ''
    },
    properties
  }
}

function getPageParentDataSourceId(page) {
  return page?.parent?.data_source_id || page?.parent?.database_id || ''
}

function assertPageInsideAllowedDataSource(page) {
  const parentDataSourceId = getPageParentDataSourceId(page)
  // Fail closed: a page that does not belong to any data source (for example
  // a workspace-level page) can never be proven to be allow-listed, so it is
  // rejected instead of skipped.
  if (!parentDataSourceId) {
    throw new Error(
      'Page does not belong to a data source, so it cannot be verified against the NotionNext MCP allow-list.'
    )
  }
  assertDataSourceAllowed(parentDataSourceId)
}

async function getAllowedPage(pageId) {
  const cleanPageId = cleanString(pageId, 160)
  if (!cleanPageId) throw new Error('pageId is required')

  const page = await notionRequest(`/pages/${cleanPageId}`)
  assertPageInsideAllowedDataSource(page)
  return page
}

async function inspectDataSourceTool(args = {}) {
  const target = resolveDataSource(cleanString(args.contentType, 40) || 'Post', cleanString(args.dataSourceId, 160))
  if (!target.id) throw new Error(`Missing data source. Set one of: ${target.candidates.join(', ')}`)

  const dataSource = await getDataSource(target.id)
  return {
    ok: true,
    target: {
      source: target.source,
      dataSourceId: mask(target.id)
    },
    title: (dataSource.title || []).map(item => item.plain_text || '').join('') || dataSource.name || '',
    properties: Object.entries(dataSource.properties || {}).map(([key, schema]) => ({
      key,
      id: schema.id,
      name: schema.name || key,
      type: schema.type
    }))
  }
}

async function queryPagesTool(args = {}) {
  const contentType = cleanString(args.contentType, 40)
  const target = resolveDataSource(contentType || 'Post', cleanString(args.dataSourceId, 160))
  if (!target.id) throw new Error(`Missing data source. Set one of: ${target.candidates.join(', ')}`)
  assertDataSourceAllowed(target.id)

  const pageSize = Math.max(1, Math.min(Number(args.pageSize) || 25, 100))
  const body = { page_size: pageSize }
  const startCursor = cleanString(args.startCursor, 160)
  if (startCursor) body.start_cursor = startCursor

  const dataSource = await getDataSource(target.id)
  const data = await notionRequest(`/data_sources/${target.id}/query`, {
    method: 'POST',
    body
  })

  const filters = {
    type: contentType ? contentTypeValues[contentType] : '',
    status: cleanString(args.status, 80),
    search: cleanString(args.search, 240).toLowerCase()
  }

  const typeKey = findPropertyKey(
    dataSource,
    propertyCandidatesFor('type', commonFieldNames.type, contentType)
  )
  const statusKey = findPropertyKey(
    dataSource,
    propertyCandidatesFor('status', commonFieldNames.status, contentType)
  )

  const pages = (data.results || [])
    .filter(page => {
      if (filters.type && typeKey) {
        const value = readNotionPropertyValue(page.properties?.[typeKey])
        if (value !== filters.type) return false
      }
      if (filters.status && statusKey) {
        const value = readNotionPropertyValue(page.properties?.[statusKey])
        if (value !== filters.status) return false
      }
      if (filters.search) {
        const text = JSON.stringify(simplifyPage(page).properties).toLowerCase()
        if (!text.includes(filters.search)) return false
      }
      return true
    })
    .map(simplifyPage)

  return {
    ok: true,
    target: {
      source: target.source,
      dataSourceId: mask(target.id)
    },
    hasMore: data.has_more === true,
    nextCursor: data.next_cursor || '',
    count: pages.length,
    pages
  }
}

async function getPageTool(args = {}) {
  const page = await getAllowedPage(args.pageId)
  const output = {
    ok: true,
    page: simplifyPage(page)
  }

  if (args.includeBlocks) {
    output.blocks = await readBlockChildren(
      page.id,
      Math.max(1, Math.min(Number(args.blockPageSize) || 50, 100))
    )
  }

  return output
}

async function readBlockChildren(blockId, pageSize) {
  const data = await notionRequest(`/blocks/${blockId}/children?page_size=${pageSize}`)
  return {
    hasMore: data.has_more === true,
    nextCursor: data.next_cursor || '',
    results: (data.results || []).map(block => simplifyBlock(block))
  }
}

function simplifyBlock(block) {
  const value = block[block.type] || {}
  return {
    id: block.id,
    type: block.type,
    hasChildren: block.has_children === true,
    text: extractBlockText(value),
    raw: value
  }
}

function extractBlockText(value) {
  const richText = value.rich_text || value.caption || []
  if (!Array.isArray(richText)) return ''
  return richText.map(item => item.plain_text || '').join('')
}

function buildUpdateProperties(fields, dataSource, contentType) {
  assertNoExtAnywhere(fields)

  const properties = {}
  const warnings = []

  for (const [fieldName, rawValue] of Object.entries(fields || {})) {
    if (fieldName === 'cover' || fieldName === 'icon') continue

    const key = findPropertyKey(
      dataSource,
      propertyCandidatesFor(fieldName, fieldName, contentType)
    )
    if (!key) {
      warnings.push(`Missing Notion property for ${fieldName}`)
      continue
    }

    const schema = dataSource.properties[key]
    const payload = buildPropertyBySchema(schema, rawValue)
    if (!payload) {
      warnings.push(`Unsupported or empty property payload for ${fieldName} (${schema.type})`)
      continue
    }
    properties[key] = payload
  }

  return { properties, warnings }
}

async function updatePageTool(args = {}) {
  const fields = args.fields && typeof args.fields === 'object' && !Array.isArray(args.fields)
    ? args.fields
    : {}
  assertNoExtAnywhere(fields)

  const page = await getAllowedPage(args.pageId)
  const contentType = cleanString(args.contentType, 40) || 'Post'
  const dataSourceId =
    cleanString(args.dataSourceId, 160) ||
    getPageParentDataSourceId(page) ||
    resolveDataSource(contentType).id
  if (!dataSourceId) throw new Error('Cannot resolve page data source id')
  assertDataSourceAllowed(dataSourceId)

  const dataSource = await getDataSource(dataSourceId)
  const built = buildUpdateProperties(fields, dataSource, contentType)
  const body = {}

  if (Object.keys(built.properties).length > 0) {
    body.properties = built.properties
  }
  if (fields.cover) {
    const cover = externalMedia(fields.cover)
    if (cover) body.cover = cover
  }
  if (fields.icon) {
    const icon = iconPayload(fields.icon)
    if (icon) body.icon = icon
  }
  if (Object.keys(body).length === 0) {
    throw new Error('No valid page updates were provided')
  }

  const updated = await notionRequest(`/pages/${page.id}`, {
    method: 'PATCH',
    body
  })

  return {
    ok: true,
    page: simplifyPage(updated),
    warnings: built.warnings
  }
}

async function appendBlocksTool(args = {}) {
  const page = await getAllowedPage(args.pageId)
  const blocks = markdownToBlocks(args.bodyMarkdown)
  if (blocks.length === 0) throw new Error('bodyMarkdown produced no blocks')

  const data = await notionRequest(`/blocks/${page.id}/children`, {
    method: 'PATCH',
    body: { children: blocks }
  })

  return {
    ok: true,
    pageId: page.id,
    appendedCount: blocks.length,
    responseCount: (data.results || []).length,
    hasMore: data.has_more === true
  }
}

async function archivePageTool(args = {}) {
  const page = await getAllowedPage(args.pageId)
  const archived = typeof args.archived === 'boolean' ? args.archived : true
  const updated = await notionRequest(`/pages/${page.id}`, {
    method: 'PATCH',
    body: { in_trash: archived }
  })

  return {
    ok: true,
    page: simplifyPage(updated)
  }
}

async function buildDraftPlan(input, options = {}) {
  const draft = normalizeDraftInput(input)
  const target = resolveDataSource(draft.contentType, draft.dataSourceId)
  const blocks = markdownToBlocks(draft.bodyMarkdown)
  const warnings = []

  if (!target.id) {
    warnings.push(
      `No data source configured. Set one of: ${target.candidates.join(', ')}`
    )
  } else {
    assertDataSourceAllowed(target.id)
  }

  let dataSource = options.dataSource || null
  if (!dataSource && options.fetchSchema && target.id && getNotionToken()) {
    dataSource = await getDataSource(target.id)
  }

  let properties = buildPreviewProperties(draft)
  if (dataSource) {
    const built = buildPropertiesFromSchema(draft, dataSource)
    properties = built.properties
    warnings.push(...built.warnings)
  }

  const requestBody = {
    parent: target.id ? { data_source_id: target.id } : { data_source_id: '<missing>' },
    properties,
    children: blocks
  }

  const cover = externalMedia(draft.cover)
  if (cover) requestBody.cover = cover
  const icon = iconPayload(draft.icon)
  if (icon) requestBody.icon = icon

  if (draft.status === publishedStatus) {
    warnings.push('This draft is marked Published. Use Invisible for review-first publishing.')
  }

  return {
    draft,
    target: {
      configured: Boolean(target.id),
      source: target.source || '',
      dataSourceId: mask(target.id),
      candidateEnv: target.candidates
    },
    requestBody,
    childrenCount: blocks.length,
    warnings
  }
}

async function callTool(name, args = {}) {
  if (name === 'notionnext_status') return getStatus()

  if (name === 'build_notion_draft') {
    const plan = await buildDraftPlan(args, { fetchSchema: false })
    return {
      ok: true,
      writesToNotion: false,
      target: plan.target,
      propertiesPreview: plan.requestBody.properties,
      childrenCount: plan.childrenCount,
      warnings: plan.warnings
    }
  }

  if (name === 'create_notion_draft') {
    const plan = await buildDraftPlan(args, { fetchSchema: true })
    if (!plan.target.configured) {
      throw new Error(`Missing data source for ${plan.draft.contentType}`)
    }
    if (!getNotionToken()) {
      throw new Error('NOTION_API_TOKEN is not configured')
    }
    const data = await notionRequest('/pages', {
      method: 'POST',
      body: plan.requestBody
    })
    return {
      ok: true,
      pageId: data.id,
      url: data.url,
      contentType: plan.draft.contentType,
      status: plan.draft.status,
      warnings: plan.warnings
    }
  }

  if (name === 'inspect_notion_data_source') {
    return inspectDataSourceTool(args)
  }

  if (name === 'query_notion_pages') {
    return queryPagesTool(args)
  }

  if (name === 'get_notion_page') {
    return getPageTool(args)
  }

  if (name === 'update_notion_page') {
    return updatePageTool(args)
  }

  if (name === 'append_notion_blocks') {
    return appendBlocksTool(args)
  }

  if (name === 'archive_notion_page') {
    return archivePageTool(args)
  }

  if (name === 'refresh_site_cache') {
    return refreshSiteCache(args)
  }

  throw new Error(`Unknown tool: ${name}`)
}

function getStatus() {
  const envStatus = {
    NOTION_PAGE_ID: hasEnv('NOTION_PAGE_ID'),
    NOTION_API_TOKEN: hasEnv('NOTION_API_TOKEN') || hasEnv('NOTION_ACCESS_TOKEN'),
    NOTION_CONTENT_DATA_SOURCE_ID: hasEnv('NOTION_CONTENT_DATA_SOURCE_ID'),
    NOTION_POSTS_DATA_SOURCE_ID: hasEnv('NOTION_POSTS_DATA_SOURCE_ID'),
    NOTION_PAGES_DATA_SOURCE_ID: hasEnv('NOTION_PAGES_DATA_SOURCE_ID'),
    NOTION_RECORDS_DATA_SOURCE_ID: hasEnv('NOTION_RECORDS_DATA_SOURCE_ID'),
    NOTION_MEMBERS_DATA_SOURCE_ID: hasEnv('NOTION_MEMBERS_DATA_SOURCE_ID'),
    NOTION_EVENTS_DATA_SOURCE_ID: hasEnv('NOTION_EVENTS_DATA_SOURCE_ID'),
    OPS_ACCESS_PASSWORD: hasEnv('OPS_ACCESS_PASSWORD'),
    MCP_SITE_BASE_URL: hasEnv('MCP_SITE_BASE_URL'),
    NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE: allowUnlistedDataSource()
  }

  const recommendations = []
  if (!envStatus.NOTION_API_TOKEN) {
    recommendations.push('Set NOTION_API_TOKEN before writing Notion drafts.')
  }
  if (!envStatus.NOTION_MEMBERS_DATA_SOURCE_ID) {
    recommendations.push('Set NOTION_MEMBERS_DATA_SOURCE_ID for Member drafts and current Event fallback.')
  }
  if (!envStatus.NOTION_EVENTS_DATA_SOURCE_ID && envStatus.NOTION_MEMBERS_DATA_SOURCE_ID) {
    recommendations.push('Events will use NOTION_MEMBERS_DATA_SOURCE_ID fallback unless NOTION_EVENTS_DATA_SOURCE_ID is set.')
  }
  if (!envStatus.NOTION_CONTENT_DATA_SOURCE_ID && !envStatus.NOTION_POSTS_DATA_SOURCE_ID) {
    recommendations.push('Set NOTION_CONTENT_DATA_SOURCE_ID or NOTION_POSTS_DATA_SOURCE_ID before writing Post/Page drafts.')
  }
  if (!envStatus.NOTION_RECORDS_DATA_SOURCE_ID && !envStatus.NOTION_CONTENT_DATA_SOURCE_ID) {
    recommendations.push('Records are still static unless a Record/content data source is configured.')
  }
  if (!envStatus.OPS_ACCESS_PASSWORD) {
    recommendations.push('Set OPS_ACCESS_PASSWORD before using refresh_site_cache.')
  }

  return {
    ok: recommendations.length === 0,
    cwd: ROOT,
    notionVersion: getNotionVersion(),
    defaultDraftStatus: defaultStatus,
    publishedStatus,
    env: envStatus,
    safeIds: {
      NOTION_PAGE_ID: mask(process.env.NOTION_PAGE_ID),
      NOTION_MEMBERS_DATA_SOURCE_ID: mask(process.env.NOTION_MEMBERS_DATA_SOURCE_ID),
      NOTION_EVENTS_DATA_SOURCE_ID: mask(process.env.NOTION_EVENTS_DATA_SOURCE_ID),
      NOTION_POSTS_DATA_SOURCE_ID: mask(process.env.NOTION_POSTS_DATA_SOURCE_ID),
      NOTION_PAGES_DATA_SOURCE_ID: mask(process.env.NOTION_PAGES_DATA_SOURCE_ID),
      NOTION_RECORDS_DATA_SOURCE_ID: mask(process.env.NOTION_RECORDS_DATA_SOURCE_ID),
      NOTION_CONTENT_DATA_SOURCE_ID: mask(process.env.NOTION_CONTENT_DATA_SOURCE_ID)
    },
    allowedDataSourceCount: configuredDataSourceIds().size,
    recommendations
  }
}

async function refreshSiteCache(args = {}) {
  const password = process.env.OPS_ACCESS_PASSWORD?.trim()
  if (!password) throw new Error('OPS_ACCESS_PASSWORD is not configured')

  // The target URL is deliberately env-only: a model-controlled base URL must
  // never receive the derived ops credential.
  const baseUrl = process.env.MCP_SITE_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LINK?.trim() ||
    'http://localhost:3000'

  const url = new URL('/api/admin/content-revalidate', baseUrl)
  const cookieToken = crypto.scryptSync(password, OPS_COOKIE_SALT, 32).toString('hex')
  const cookie = `${OPS_COOKIE_NAME}=${cookieToken}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie
    },
    body: JSON.stringify({
      eventSlug: cleanString(args.eventSlug, 160)
    })
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { text }
  }

  if (!response.ok) {
    throw new Error(`Refresh failed ${response.status}: ${JSON.stringify(data).slice(0, 500)}`)
  }

  return {
    ok: true,
    baseUrl,
    data
  }
}

function getResource(uri) {
  if (uri === 'notionnext://status/config') {
    return {
      mimeType: 'application/json',
      text: JSON.stringify(getStatus(), null, 2)
    }
  }

  if (uri === 'notionnext://schemas/content') {
    return {
      mimeType: 'text/markdown',
      text: `# NotionNext Notion Content Schema

## Common fields
- title: Notion title
- type: Post, Page, Record, Event, or Member
- status: Invisible by default, Published after review
- slug: public path slug
- summary: card and SEO summary
- category, tags, date: optional first-class metadata
- bodyMarkdown: converted into Notion blocks when creating a page
- cover: written to the native Notion Page Cover

## NotionNext-native write contract
- ext is forbidden for every content type and every write tool.
- Never serialize structured data into a rich-text property.
- Put structured metadata in first-class Notion properties.
- Put long-form copy, headings, lists, outcomes, and image blocks in the page body.
- Put artwork in the native Notion Page Cover so Change/Reposition remains available.

## Record fields
- record.location
- record.related_event_slug
- map legacy recordType to category and dateText to date
- put legacy outcomes into bodyMarkdown as headings or list blocks

## Event fields
- event.event_start, event.event_end
- event.location
- event.organizer_slugs
- event.website
- event.registration_qr
- event.event_status, event.event_format, event.public_listing
- event.cover_position only when a manual fallback is required; prefer native cover Reposition

## Member fields
- member.avatar, member.role, member.bio, member.quote
- member.website, member.social_github, member.social_x, member.social_linkedin
- member.featured, member.verified

## Data source env mapping
- Post: NOTION_POSTS_DATA_SOURCE_ID or NOTION_CONTENT_DATA_SOURCE_ID
- Page: NOTION_PAGES_DATA_SOURCE_ID or NOTION_CONTENT_DATA_SOURCE_ID
- Record: NOTION_RECORDS_DATA_SOURCE_ID or NOTION_CONTENT_DATA_SOURCE_ID
- Event: NOTION_EVENTS_DATA_SOURCE_ID or NOTION_MEMBERS_DATA_SOURCE_ID
- Member: NOTION_MEMBERS_DATA_SOURCE_ID

## Read/write tools
- inspect_notion_data_source: read schema
- query_notion_pages: list pages from an allowed data source
- get_notion_page: read one page and optional first-level blocks
- update_notion_page: update properties, cover, or icon
- append_notion_blocks: append Markdown-converted blocks
- archive_notion_page: archive or restore a page

By default, explicit dataSourceId/page operations are restricted to configured NotionNext data source ids. Set NOTIONNEXT_MCP_ALLOW_UNLISTED_DATA_SOURCE=true only for a trusted local debugging session.
`
    }
  }

  if (uri === 'notionnext://guides/workflow') {
    return {
      mimeType: 'text/markdown',
      text: `# NotionNext Content Publishing Workflow

1. Use notionnext_status to verify Notion token, data sources, and ops password.
2. Model content with first-class properties, bodyMarkdown blocks, and a native cover. Never write ext.
3. Use build_notion_draft to preview the Notion payload.
4. Use create_notion_draft to create an Invisible draft.
5. Use query_notion_pages/get_notion_page to inspect existing content.
6. Use update_notion_page or append_notion_blocks for controlled edits.
7. Review and switch status to Published in Notion.
8. Use refresh_site_cache to revalidate the public site.

The MCP is a protocol layer for writing. The website remains NotionNext-driven, so content display still follows the existing routes and data normalization.
`
    }
  }

  throw new Error(`Unknown resource: ${uri}`)
}

function getPrompt(name, args = {}) {
  if (name === 'notionnext-content-brief') {
    return {
      description: 'Draft content copy for a NotionNext site.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Write ${args.contentType || 'website'} content for a NotionNext site based on the user's materials and goals.

Goal: ${args.goal || 'publish clear, useful content for this site'}

Voice:
- public, concrete, warm, action-oriented
- ground every claim in real facts: dates, people, links, and verifiable results
- avoid hype, vague AI slogans, and unsupported metrics

Return:
- title
- 1 sentence summary
- suggested slug
- public body copy in Markdown
- Notion fields worth setting`
          }
        }
      ]
    }
  }

  if (name === 'notionnext-draft-payload') {
    return {
      description: 'Convert approved copy into a Notion draft payload.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Convert approved ${args.contentType || 'content'} copy into arguments for build_notion_draft.

Rules:
- default status must be Invisible
- include a clean slug
- never write ext; the MCP rejects it even when it is empty
- put metadata in first-class properties: category/date/tags plus Record, Event, or Member fields
- put all article copy, outcomes, headings, lists, and inline images in bodyMarkdown page blocks
- use cover for the native Notion Page Cover so Change/Reposition keeps working
- use Record, Event, and Member nested fields only when the content type needs them
- do not invent private data or unapproved member details`
          }
        }
      ]
    }
  }

  throw new Error(`Unknown prompt: ${name}`)
}

function jsonContent(value) {
  return {
    content: [
      {
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      }
    ]
  }
}

async function handleRequest(message) {
  const method = message.method
  const params = message.params || {}

  switch (method) {
    case 'initialize':
      return {
        protocolVersion: params.protocolVersion || DEFAULT_PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        serverInfo: {
          name: 'notionnext-content-mcp',
          version: '0.2.0'
        },
        instructions: 'Use this server to draft site content with the NotionNext-native write contract: never write ext; use first-class properties, page blocks, and the native Page Cover. Drafts default to Invisible.'
      }
    case 'ping':
      return {}
    case 'tools/list':
      return { tools }
    case 'tools/call':
      return jsonContent(await callTool(params.name, params.arguments || {}))
    case 'resources/list':
      return { resources }
    case 'resources/read': {
      const resource = getResource(params.uri)
      return {
        contents: [
          {
            uri: params.uri,
            mimeType: resource.mimeType,
            text: resource.text
          }
        ]
      }
    }
    case 'prompts/list':
      return { prompts }
    case 'prompts/get':
      return getPrompt(params.name, params.arguments || {})
    default:
      throw Object.assign(new Error(`Method not found: ${method}`), {
        code: -32601
      })
  }
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

function respond(id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function respondError(id, error) {
  send({
    jsonrpc: '2.0',
    id,
    error: {
      code: error.code || -32000,
      message: error.message || String(error)
    }
  })
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    if (!line.trim()) continue
    let message
    try {
      message = JSON.parse(line)
    } catch (error) {
      respondError(null, Object.assign(new Error('Invalid JSON'), { code: -32700 }))
      continue
    }

    if (!Object.prototype.hasOwnProperty.call(message, 'id')) {
      continue
    }

    try {
      respond(message.id, await handleRequest(message))
    } catch (error) {
      respondError(message.id, error)
    }
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

// Exported so smoke/unit tests can verify the write-boundary checks without
// any network access or a configured Notion token.
module.exports = { assertPageInsideAllowedDataSource, assertDataSourceAllowed }

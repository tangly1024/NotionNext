const NOTION_API_BASE = 'https://api.notion.com/v1'
const DEFAULT_NOTION_VERSION = '2022-06-28'

function normalizeEnv(value) {
  return typeof value === 'string'
    ? value.replace(/\\n/g, '').trim()
    : value
}

function getLeadDatabaseConfig() {
  return {
    apiKey: normalizeEnv(process.env.NOTION_API_KEY),
    databaseId: normalizeEnv(
      process.env.LEAD_NOTION_DATABASE_ID ||
        process.env.NOTION_LEAD_DATABASE_ID ||
        ''
    )
  }
}

function hasLeadDatabaseConfig(config = getLeadDatabaseConfig()) {
  return Boolean(config.apiKey && config.databaseId)
}

async function notionRequest(path, init = {}) {
  const { apiKey } = getLeadDatabaseConfig()
  if (!apiKey) {
    throw new Error('NOTION_API_KEY is missing')
  }

  const response = await fetch(`${NOTION_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version':
        normalizeEnv(process.env.NOTION_API_VERSION) ||
        DEFAULT_NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      data?.message || `Notion request failed with status ${response.status}`
    )
  }
  return data
}

function findProperty(properties, predicate) {
  return Object.entries(properties || {}).find(([name, property]) =>
    predicate(name, property)
  )
}

function findPreferredProperty(properties, matchers = []) {
  for (const matcher of matchers) {
    const entry = findProperty(properties, matcher)
    if (entry) {
      return entry
    }
  }
  return null
}

function createTitleProperty(content) {
  return {
    title: [
      {
        text: { content: String(content).slice(0, 2000) }
      }
    ]
  }
}

function createRichTextProperty(content) {
  return {
    rich_text: [
      {
        text: { content: String(content).slice(0, 2000) }
      }
    ]
  }
}

function createSelectProperty(content) {
  return {
    select: {
      name: String(content).slice(0, 100)
    }
  }
}

function createUrlProperty(content) {
  return {
    url: String(content).slice(0, 2000)
  }
}

function buildLeadProperties(schema, lead) {
  const properties = {}
  const titleEntry =
    findProperty(schema, (_, property) => property.type === 'title') || []
  const emailEntry = findProperty(
    schema,
    (_, property) => property.type === 'email'
  )
  const createdTimeEntry = findProperty(
    schema,
    (name, property) => property.type === 'date' && /created|submitted/i.test(name)
  )
  const sourceEntry = findProperty(
    schema,
    (name, property) =>
      ['rich_text', 'select'].includes(property.type) &&
      /source|channel/i.test(name)
  )
  const localeEntry = findProperty(
    schema,
    (name, property) =>
      ['rich_text', 'select'].includes(property.type) &&
      /locale|language|lang/i.test(name)
  )
  const statusEntry = findProperty(
    schema,
    (name, property) =>
      ['select', 'status'].includes(property.type) && /status/i.test(name)
  )
  const pageUrlEntry = findPreferredProperty(schema, [
    (name, property) => property.type === 'url' && /^pageurl$/i.test(name),
    (name, property) => property.type === 'url' && /^page[-_ ]?url$/i.test(name),
    (name, property) =>
      property.type === 'url' && /page|landing|source/i.test(name),
    (name, property) => property.type === 'url' && /url|link/i.test(name),
    (name, property) =>
      property.type === 'rich_text' && /^pageurl$/i.test(name),
    (name, property) =>
      property.type === 'rich_text' && /^page[-_ ]?url$/i.test(name),
    (name, property) =>
      property.type === 'rich_text' && /page|landing|source/i.test(name),
    (name, property) =>
      property.type === 'rich_text' && /url|link/i.test(name)
  ])
  const noteEntry = findProperty(
    schema,
    (name, property) =>
      property.type === 'rich_text' &&
      /note|details|meta|message|context/i.test(name)
  )

  if (titleEntry[0]) {
    properties[titleEntry[0]] = createTitleProperty(
      `CTA Lead ${lead.email} ${lead.submittedAt}`
    )
  }

  if (emailEntry?.[0]) {
    properties[emailEntry[0]] = { email: lead.email }
  }

  if (createdTimeEntry?.[0]) {
    properties[createdTimeEntry[0]] = {
      date: { start: lead.submittedAt }
    }
  }

  if (sourceEntry?.[0]) {
    properties[sourceEntry[0]] =
      sourceEntry[1].type === 'select'
        ? createSelectProperty(lead.source)
        : createRichTextProperty(lead.source)
  }

  if (localeEntry?.[0]) {
    properties[localeEntry[0]] =
      localeEntry[1].type === 'select'
        ? createSelectProperty(lead.locale)
        : createRichTextProperty(lead.locale)
  }

  if (statusEntry?.[0]) {
    const preferredStatus =
      statusEntry[1].type === 'status'
        ? statusEntry[1].status?.options?.find(option =>
            /new|lead|todo|not started/i.test(option.name)
          ) || statusEntry[1].status?.options?.[0]
        : statusEntry[1].select?.options?.find(option =>
            /new|lead|todo|not started/i.test(option.name)
          ) || statusEntry[1].select?.options?.[0]

    if (preferredStatus?.name) {
      properties[statusEntry[0]] =
        statusEntry[1].type === 'status'
          ? { status: { name: preferredStatus.name } }
          : createSelectProperty(preferredStatus.name)
    }
  }

  if (pageUrlEntry?.[0]) {
    properties[pageUrlEntry[0]] =
      pageUrlEntry[1].type === 'url'
        ? createUrlProperty(lead.pageUrl)
        : createRichTextProperty(lead.pageUrl)
  }

  if (noteEntry?.[0]) {
    properties[noteEntry[0]] = createRichTextProperty(
      JSON.stringify(
        {
          referrer: lead.referrer,
          ip: lead.ip,
          userAgent: lead.userAgent
        },
        null,
        2
      )
    )
  }

  return properties
}

async function storeLeadInNotion(lead) {
  const config = getLeadDatabaseConfig()
  if (!hasLeadDatabaseConfig(config)) {
    throw new Error('Notion lead database is not configured')
  }

  const database = await notionRequest(`/databases/${config.databaseId}`, {
    method: 'GET'
  })

  const properties = buildLeadProperties(database.properties, lead)
  if (!Object.keys(properties).length) {
    throw new Error('Unable to map Notion lead database properties')
  }

  const created = await notionRequest('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: config.databaseId },
      properties
    })
  })

  return {
    id: created.id,
    url: created.url || null
  }
}

export {
  getLeadDatabaseConfig,
  hasLeadDatabaseConfig,
  storeLeadInNotion
}

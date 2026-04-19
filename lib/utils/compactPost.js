const COMPACT_PATH_REDIRECTS = new Map([
  ['/aboutme', '/about'],
  ['aboutme', '/about']
])

function normalizeCompactPath(value) {
  if (typeof value !== 'string') {
    return value ?? null
  }

  const trimmed = value.trim()
  return COMPACT_PATH_REDIRECTS.get(trimmed) || trimmed
}

export function compactPostForCard(post, options = {}) {
  if (!post) {
    return post
  }

  const { includeResults = false } = options

  const compact = {
    id: post.id ?? null,
    href: normalizeCompactPath(post.href),
    slug: normalizeCompactPath(post.slug),
    title: post.title ?? null,
    summary: post.summary ?? null,
    category: post.category ?? null,
    tags: post.tags ?? null,
    tagItems: post.tagItems ?? null,
    pageCover: post.pageCover ?? null,
    pageCoverThumbnail: post.pageCoverThumbnail ?? null,
    pageIcon: post.pageIcon ?? null,
    password: post.password ?? null,
    publishDay: post.publishDay ?? null,
    publishDate: post.publishDate ?? null,
    date: post.date ?? null,
    type: post.type ?? null,
    status: post.status ?? null
  }

  if (includeResults && Array.isArray(post.results)) {
    compact.results = post.results.slice(0, 6)
  }

  return compact
}

export function compactPostForArchive(post) {
  if (!post) {
    return post
  }

  return {
    id: post.id ?? null,
    href: normalizeCompactPath(post.href),
    slug: normalizeCompactPath(post.slug),
    title: post.title ?? null,
    category: post.category ?? null,
    publishDay: post.publishDay ?? null,
    publishDate: post.publishDate ?? null
  }
}

export function compactPostForLatest(post) {
  if (!post) {
    return post
  }

  return {
    id: post.id ?? null,
    href: normalizeCompactPath(post.href),
    slug: normalizeCompactPath(post.slug),
    title: post.title ?? null,
    pageCoverThumbnail: post.pageCoverThumbnail ?? null,
    lastEditedDay: post.lastEditedDay ?? null,
    publishDay: post.publishDay ?? null
  }
}

export function compactPostForNav(post) {
  if (!post) {
    return post
  }

  return {
    short_id: post.short_id ?? null,
    href: normalizeCompactPath(post.href),
    slug: normalizeCompactPath(post.slug),
    title: post.title ?? null,
    tags: post.tags ?? null,
    lastEditedDate: post.lastEditedDate ?? null,
    pageCoverThumbnail: post.pageCoverThumbnail ?? null
  }
}

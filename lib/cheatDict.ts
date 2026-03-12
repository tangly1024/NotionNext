// ✅ 兼容：低 TS target + noUncheckedIndexedAccess

export type CheatTranslation = {
  translation: string
  back_translation: string
  frequency?: number
  tags?: string[]
}

export type CheatItem = {
  source: string
  normalized?: string
  targets: Record<string, CheatTranslation[]>
  phrases?: string[]
}

export type CheatDict = {
  lang: string
  version: string
  items: CheatItem[]
  meta?: { total: number; lastUpdated: string }
}

// -------------------- LRU Cache --------------------
class LRUCache<K, V> {
  private cache = new Map<K, V>()

  constructor(private readonly max = 200) {}

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined
    const v = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, v)
    return v
  }

  set(key: K, val: V): void {
    if (this.cache.has(key)) this.cache.delete(key)
    this.cache.set(key, val)
    if (this.cache.size > this.max) {
      const it = this.cache.keys().next()
      if (!it.done) this.cache.delete(it.value)
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

// -------------------- normalize --------------------
const normalizeCache = new LRUCache<string, string>(1000)

const PUNCT_RE =
  /[\s\n\r\t@#$%^&*()_\-+={}\[\]\\|;:'",.，！？：；''""·（）【】《》〈〉…—–―「」『』﹏￥]+/g

export function normalizeLoose(s: string | null | undefined): string {
  const raw = s ?? ''
  const cached = normalizeCache.get(raw)
  if (cached !== undefined) return cached

  const t = raw.toLowerCase().trim().replace(/\s+/g, ' ')
  const out = t.replace(PUNCT_RE, '')

  normalizeCache.set(raw, out)
  return out
}

// -------------------- dict loading --------------------
export type CheatDictLoader = (lang: string) => Promise<CheatDict | null>

let loadCheatDictImpl: CheatDictLoader | null = null

export function setCheatDictLoader(loader: CheatDictLoader): void {
  loadCheatDictImpl = loader
}

export async function loadCheatDict(lang: string): Promise<CheatDict | null> {
  if (loadCheatDictImpl) return loadCheatDictImpl(lang)

  const url = `/dicts/${encodeURIComponent(lang)}.json`
  const res = await fetch(url, { cache: 'force-cache' })
  if (!res.ok) return null

  const dict = (await res.json()) as CheatDict
  if (!dict || !Array.isArray(dict.items)) return null

  return dict
}

// -------------------- indexing --------------------
type DictIndex = {
  exactIndex: Map<string, number[]>
}

const dictIndexCache = new Map<string, DictIndex>()
const queryCache = new LRUCache<string, CheatTranslation[] | null>(300)

const getIndexKey = (dict: CheatDict): string => `${dict.lang}@${dict.version}`

const allTextsOfItem = (item: CheatItem): string[] => {
  const extra = Array.isArray(item.phrases) ? item.phrases : []
  return [item.source, ...extra].filter(
    (x): x is string => typeof x === 'string' && x.length > 0
  )
}

const buildExactIndex = (items: CheatItem[]): Map<string, number[]> => {
  const index = new Map<string, number[]>()

  items.forEach((item, idx) => {
    const texts = allTextsOfItem(item)

    texts.forEach((text, textIdx) => {
      const key =
        textIdx === 0 && item.normalized
          ? item.normalized
          : normalizeLoose(text)

      if (textIdx === 0 && !item.normalized) {
        item.normalized = key
      }

      if (!key) return

      const arr = index.get(key) ?? []
      arr.push(idx)
      index.set(key, arr)
    })
  })

  return index
}

const getOrBuildIndex = (dict: CheatDict): DictIndex => {
  const k = getIndexKey(dict)
  const cached = dictIndexCache.get(k)
  if (cached) return cached

  const exactIndex = buildExactIndex(dict.items)
  const idx: DictIndex = { exactIndex }
  dictIndexCache.set(k, idx)
  return idx
}

// -------------------- results formatting --------------------
const formatResults = (
  translations: CheatTranslation[] | undefined
): CheatTranslation[] | null => {
  if (!Array.isArray(translations) || translations.length === 0) {
    return null
  }

  const cleaned: CheatTranslation[] = translations
    .map(x => ({
      translation: String(x?.translation ?? '').trim(),
      back_translation: String(x?.back_translation ?? '').trim(),
      frequency: x?.frequency ?? 0,
      tags: Array.isArray(x?.tags) ? (x.tags as string[]) : []
    }))
    .filter(x => x.translation || x.back_translation)
    .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))

  if (cleaned.length === 0) return null

  const seen = new Set<string>()
  const unique = cleaned.filter(x => {
    const k = `${x.translation}|${x.back_translation}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return unique.slice(0, 4)
}

// -------------------- API --------------------
export type MatchOptions = {
  useCache?: boolean
}

export async function matchCheatExact(
  dict: CheatDict | null | string,
  input: string,
  targetLang: string,
  options: MatchOptions = {}
): Promise<CheatTranslation[] | null> {
  const useCache = options.useCache !== false
  const norm = normalizeLoose(input)
  const dictLang = typeof dict === 'string' ? dict : dict?.lang
  const cacheKey = `${dictLang ?? 'null'}|${norm}|${targetLang}|exact`

  if (useCache) {
    const cached = queryCache.get(cacheKey)
    if (cached !== undefined) return cached
  }

  const dictObj: CheatDict | null =
    typeof dict === 'string' ? await loadCheatDict(dict) : dict

  if (!dictObj || !norm) {
    if (useCache) queryCache.set(cacheKey, null)
    return null
  }

  const { exactIndex } = getOrBuildIndex(dictObj)
  const ids = exactIndex.get(norm)
  const first = ids ? ids[0] : undefined

  if (first === undefined) {
    if (useCache) queryCache.set(cacheKey, null)
    return null
  }

  const hit = dictObj.items[first]
  if (!hit) {
    if (useCache) queryCache.set(cacheKey, null)
    return null
  }

  const result = formatResults(hit.targets?.[targetLang])

  if (useCache) queryCache.set(cacheKey, result)
  return result
}

// 兼容旧接口：默认也只走 exact
export type LegacyMatchOptions = {
  mode?: 'exact'
  useCache?: boolean
}

export async function matchCheatLoose(
  dict: CheatDict | null | string,
  input: string,
  targetLang: string,
  options: LegacyMatchOptions = {}
): Promise<CheatTranslation[] | null> {
  return matchCheatExact(dict, input, targetLang, {
    useCache: options.useCache
  })
}

export async function preloadDicts(langs: string[]): Promise<void> {
  const dicts = await Promise.all(langs.map(loadCheatDict))
  dicts.forEach(d => {
    if (d) getOrBuildIndex(d)
  })
}

export function clearCache(lang?: string, version?: string): void {
  if (lang && version) {
    dictIndexCache.delete(`${lang}@${version}`)
  } else if (lang) {
    for (const k of Array.from(dictIndexCache.keys())) {
      if (k.indexOf(`${lang}@`) === 0) dictIndexCache.delete(k)
    }
  } else {
    dictIndexCache.clear()
  }

  queryCache.clear()
  normalizeCache.clear()
}

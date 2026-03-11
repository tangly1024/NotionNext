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

const PUNCT_RE = /[\s\n\r\t@#$%^&*()_\-+={}\[\]\\|;:'",.，！？：；''""·（）【】《》〈〉…—–―「」『』﹏￥]+/g

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

export function setCheatDictLoader(loader: CheatDictLoader) {
  loadCheatDictImpl = loader
}

export async function loadCheatDict(lang: string): Promise<CheatDict | null> {
  if (loadCheatDictImpl) return loadCheatDictImpl(lang)
  const url = `/dicts/${encodeURIComponent(lang)}.json`
  const res = await fetch(url, { cache: 'force-cache' })
  if (!res.ok) return null
  const dict = (await res.json()) as CheatDict
  if (!dict?.items || !Array.isArray(dict.items)) return null
  return dict
}

// -------------------- indexing --------------------
type DictIndex = {
  exactIndex: Map<string, number[]>
  wordIndex: Map<string, Set<number>>
  phraseIndex: Map<string, Set<number>>
}

const dictIndexCache = new Map<string, DictIndex>()
const queryCache = new LRUCache<string, CheatTranslation[] | null>(300)

const getIndexKey = (dict: CheatDict) => `${dict.lang}@${dict.version}`

const allTextsOfItem = (item: CheatItem): string[] => {
  const extra = Array.isArray(item.phrases) ? item.phrases : []
  return [item.source, ...extra].filter((x): x is string => typeof x === 'string' && x.length > 0)
}

const buildExactIndex = (items: CheatItem[]): Map<string, number[]> => {
  const index = new Map<string, number[]>()
  items.forEach((item, idx) => {
    if (!item.normalized) item.normalized = normalizeLoose(item.source)
    const key = item.normalized
    if (!key) return
    const arr = index.get(key) ?? []
    arr.push(idx)
    index.set(key, arr)
  })
  return index
}

const splitAlphaNumTokens = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(w => w.length >= 2)
}

const buildWordIndex = (items: CheatItem[]): Map<string, Set<number>> => {
  const index = new Map<string, Set<number>>()
  items.forEach((item, idx) => {
    const tokens = new Set<string>()
    for (const text of allTextsOfItem(item)) {
      if (/[\u4e00-\u9fff]/.test(text)) {
        const chars = Array.from(text)
        for (let i = 0; i < chars.length; i++) {
          const c1 = chars[i]
          if (!c1) continue
          tokens.add(c1)
          const c2 = chars[i + 1]
          if (c2) tokens.add(c1 + c2)
        }
      } else {
        const ws = splitAlphaNumTokens(text)
        for (const w of ws) tokens.add(w)
      }
    }
    tokens.forEach(tok => {
      if (!tok) return
      if (!index.has(tok)) index.set(tok, new Set<number>())
      index.get(tok)!.add(idx)
    })
  })
  return index
}

const buildPhraseIndex = (items: CheatItem[]): Map<string, Set<number>> => {
  const index = new Map<string, Set<number>>()
  items.forEach((item, idx) => {
    for (const text of allTextsOfItem(item)) {
      if (/[\u4e00-\u9fff]/.test(text)) {
        const chars = Array.from(text)
        const len = chars.length
        if (len < 3) continue
        const minLen = 3, maxLen = Math.min(6, len)
        for (let l = minLen; l <= maxLen; l++) {
          for (let i = 0; i <= len - l; i++) {
            const phrase = chars.slice(i, i + l).join('')
            if (!index.has(phrase)) index.set(phrase, new Set<number>())
            index.get(phrase)!.add(idx)
          }
        }
      }
    }
  })
  return index
}

const getOrBuildIndex = (dict: CheatDict): DictIndex => {
  const k = getIndexKey(dict)
  const cached = dictIndexCache.get(k)
  if (cached) return cached
  const exactIndex = buildExactIndex(dict.items)
  const wordIndex = buildWordIndex(dict.items)
  const phraseIndex = buildPhraseIndex(dict.items)
  const idx: DictIndex = { exactIndex, wordIndex, phraseIndex }
  dictIndexCache.set(k, idx)
  return idx
}

// -------------------- results formatting --------------------
const formatResults = (translations: CheatTranslation[] | undefined): CheatTranslation[] => {
  if (!Array.isArray(translations) || translations.length === 0) {
    return [{ translation: '（字典数据为空）', back_translation: '', frequency: 0, tags: [] }]
  }
  const cleaned = translations
    .map(x => ({
      translation: String(x?.translation ?? '').trim(),
      back_translation: String(x?.back_translation ?? '').trim(),
      frequency: x?.frequency ?? 0,
      tags: Array.isArray(x?.tags) ? (x!.tags as string[]) : []
    }))
    .filter(x => x.translation || x.back_translation)
    .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))
  const seen = new Set<string>()
  const unique = cleaned.filter(x => {
    const k = `${x.translation}|${x.back_translation}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  const res = unique.slice(0, 4)
  while (res.length < 4 && res.length > 0) res.push({ ...res[res.length - 1] })
  return res.length ? res : [{ translation: '（字典数据为空）', back_translation: '', frequency: 0, tags: [] }]
}

// -------------------- matching --------------------
const matchByPhrases = (
  dict: CheatDict,
  input: string,
  targetLang: string,
  phraseIndex: Map<string, Set<number>>,
  minScore = 2.6
): CheatTranslation[] | null => {
  const chars = Array.from(input)
  const scores = new Map<number, number>()
  for (let len = Math.min(6, chars.length); len >= 3; len--) {
    for (let i = 0; i <= chars.length - len; i++) {
      const slice = chars.slice(i, i + len)
      if (slice.length !== len) continue
      const phrase = slice.join('')
      const ids = phraseIndex.get(phrase)
      if (!ids) continue
      const weight = len * (1 - i / Math.max(1, chars.length))
      ids.forEach(id => scores.set(id, (scores.get(id) ?? 0) + weight))
    }
  }
  if (scores.size === 0) return null
  const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  if (!top) return null
  const topIdx = top[0]
  const topScore = top[1]
  const second = sorted.length > 1 ? sorted[1] : undefined
  const secondScore = second ? second[1] : 0
  if (topScore < minScore) return null
  if (secondScore > 0 && topScore / secondScore < 1.08) return null
  const hit = dict.items[topIdx]
  if (!hit) return null
  return formatResults(hit.targets?.[targetLang])
}

const matchByWords = (
  dict: CheatDict,
  input: string,
  targetLang: string,
  wordIndex: Map<string, Set<number>>,
  minHits = 2
): CheatTranslation[] | null => {
  const tokens: string[] = []
  if (/[\u4e00-\u9fff]/.test(input)) {
    const cs = Array.from(input)
    for (const c of cs) if (c) tokens.push(c)
  } else {
    tokens.push(...splitAlphaNumTokens(input))
  }
  const hits = new Map<number, number>()
  const uniq = new Set(tokens)
  uniq.forEach(tok => {
    const ids = wordIndex.get(tok)
    if (!ids) return
    ids.forEach(id => hits.set(id, (hits.get(id) ?? 0) + 1))
  })
  if (hits.size === 0) return null
  const sorted = Array.from(hits.entries()).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  if (!top) return null
  const topIdx = top[0]
  const topHits = top[1]
  if (topHits < minHits) return null
  const hit = dict.items[topIdx]
  if (!hit) return null
  const res = formatResults(hit.targets?.[targetLang])
  return res.map(r => ({ ...r, tags: [...(r.tags ?? []), 'word-match'] }))
}

// -------------------- API --------------------
export type MatchOptions = {
  mode?: 'exact' | 'phrase' | 'word' | 'hybrid'
  useCache?: boolean
}

export async function matchCheatLoose(
  dict: CheatDict | null | string,
  input: string,
  targetLang: string,
  options: MatchOptions = {}
): Promise<CheatTranslation[] | null> {
  const { mode = 'hybrid', useCache = true } = options
  const norm = normalizeLoose(input)
  const dictLang = typeof dict === 'string' ? dict : dict?.lang
  const cacheKey = `${dictLang ?? 'null'}|${norm}|${targetLang}|${mode}`
  if (useCache) {
    const cached = queryCache.get(cacheKey)
    if (cached !== undefined) return cached
  }
  const dictObj: CheatDict | null = typeof dict === 'string' ? await loadCheatDict(dict) : dict
  if (!dictObj || !norm) {
    if (useCache) queryCache.set(cacheKey, null)
    return null
  }
  const { exactIndex, phraseIndex, wordIndex } = getOrBuildIndex(dictObj)
  let result: CheatTranslation[] | null = null
  if (mode === 'exact' || mode === 'hybrid') {
    const ids = exactIndex.get(norm)
    const first = ids ? ids[0] : undefined
    if (first !== undefined) {
      const hit = dictObj.items[first]
      if (hit) result = formatResults(hit.targets?.[targetLang])
    }
  }
  if (!result && (mode === 'phrase' || mode === 'hybrid') && input.length >= 3) {
    result = matchByPhrases(dictObj, input, targetLang, phraseIndex)
  }
  if (!result && (mode === 'word' || mode === 'hybrid')) {
    result = matchByWords(dictObj, input, targetLang, wordIndex)
  }
  if (useCache) queryCache.set(cacheKey, result)
  return result
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

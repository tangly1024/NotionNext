// src/lib/cheatDict.ts
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
  phrases?: string[] // 额外短语/同义写法
}

export type CheatDict = {
  lang: string
  version: string
  items: CheatItem[]
  meta?: { total: number; lastUpdated: string }
}

// -------------------- normalize --------------------

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
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }
  clear(): void { this.cache.clear() }
}

const normalizeCache = new LRUCache<string, string>(1000)

/** 更稳的“宽松归一化”：去空白/标点/符号，转小写 */
export const normalizeLoose = (s: string): string => {
  const key = s ?? ''
  const hit = normalizeCache.get(key)
  if (hit !== undefined) return hit

  const t = String(s ?? '').trim().toLowerCase()
  let out = t

  // 优先用 Unicode property escapes
  try {
    out = out.replace(/[\p{P}\p{S}\s]+/gu, '')
  } catch {
    // fallback：老环境（不支持 \p{..}）
    out = out.replace(/[\s\r\n\t]+|[~`!@#$%^&*()_\-+={}\[\]\\|;:'",.<>/?，。！？、；：‘’“”（）【】《》〈〉…·—–―「」『』﹏￥]+/g, '')
  }

  normalizeCache.set(key, out)
  return out
}

// -------------------- dict loading --------------------

/**
 * 你可以按需替换 loader（比如从 IndexedDB / 本地文件 / import JSON）
 */
export type CheatDictLoader = (lang: string) => Promise<CheatDict | null>

let loadCheatDictImpl: CheatDictLoader | null = null
export function setCheatDictLoader(loader: CheatDictLoader) {
  loadCheatDictImpl = loader
}

/** 默认 loader：从同源静态文件拉取 /dicts/{lang}.json */
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

const dictIndexCache = new Map<string, DictIndex>() // key: lang@version
const queryCache = new LRUCache<string, CheatTranslation[] | null>(300)

const getIndexKey = (dict: CheatDict) => `${dict.lang}@${dict.version}`

const allTextsOfItem = (item: CheatItem): string[] => {
  const extra = Array.isArray(item.phrases) ? item.phrases : []
  return [item.source, ...extra].filter(Boolean)
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

const buildWordIndex = (items: CheatItem[]): Map<string, Set<number>> => {
  const index = new Map<string, Set<number>>()

  items.forEach((item, idx) => {
    const tokens = new Set<string>()

    for (const text of allTextsOfItem(item)) {
      if (/[\u4e00-\u9fff]/.test(text)) {
        const chars = Array.from(text)
        for (let i = 0; i < chars.length; i++) {
          tokens.add(chars[i])
          if (i + 1 < chars.length) tokens.add(chars[i] + chars[i + 1]) // 2-gram
        }
      } else {
        for (const w of text.toLowerCase().split(/[\s\p{P}]+/u).filter(x => x.length >= 2)) {
          tokens.add(w)
        }
      }
    }

    tokens.forEach(tok => {
      if (!index.has(tok)) index.set(tok, new Set())
      index.get(tok)!.add(idx)
    })
  })

  return index
}

const buildPhraseIndex = (items: CheatItem[]): Map<string, Set<number>> => {
  const index = new Map<string, Set<number>>()

  items.forEach((item, idx) => {
    for (const text of allTextsOfItem(item)) {
      const chars = Array.from(text)
      if (chars.length < 3) continue

      for (let len = 3; len <= Math.min(6, chars.length); len++) {
        for (let i = 0; i <= chars.length - len; i++) {
          const phrase = chars.slice(i, i + len).join('')
          if (!index.has(phrase)) index.set(phrase, new Set())
          index.get(phrase)!.add(idx)
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
    return [{ translation: '（暂无翻译）', back_translation: '', frequency: 0, tags: [] }]
  }

  const cleaned = translations
    .map(x => ({
      translation: String(x?.translation ?? '').trim(),
      back_translation: String(x?.back_translation ?? '').trim(),
      frequency: x?.frequency ?? 0,
      tags: Array.isArray(x?.tags) ? x!.tags! : []
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
  minScore = 2.6 // 置信度阈值：过低不返回，防止乱猜
): CheatTranslation[] | null => {
  const chars = Array.from(input)
  const scores = new Map<number, number>()

  for (let len = Math.min(6, chars.length); len >= 3; len--) {
    for (let i = 0; i <= chars.length - len; i++) {
      const phrase = chars.slice(i, i + len).join('')
      const ids = phraseIndex.get(phrase)
      if (!ids) continue

      const weight = len * (1 - i / Math.max(1, chars.length))
      ids.forEach(id => scores.set(id, (scores.get(id) ?? 0) + weight))
    }
  }

  if (scores.size === 0) return null

  const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1])
  const [topIdx, topScore] = sorted[0]
  const secondScore = sorted[1]?.[1] ?? 0

  // 两个简单阈值：分数太低、或领先优势太小，都不返回
  if (topScore < minScore) return null
  if (secondScore > 0 && topScore / secondScore < 1.08) return null

  return formatResults(dict.items[topIdx]?.targets?.[targetLang])
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
    tokens.push(...Array.from(input))
  } else {
    tokens.push(...input.toLowerCase().split(/[\s\p{P}]+/u).filter(w => w.length >= 2))
  }

  const hits = new Map<number, number>()
  for (const tok of new Set(tokens)) {
    const ids = wordIndex.get(tok)
    if (!ids) continue
    ids.forEach(id => hits.set(id, (hits.get(id) ?? 0) + 1))
  }
  if (hits.size === 0) return null

  const [topIdx, topHits] = Array.from(hits.entries()).sort((a, b) => b[1] - a[1])[0]
  if (topHits < minHits) return null

  const res = formatResults(dict.items[topIdx]?.targets?.[targetLang])
  return res.map(r => ({ ...r, tags: [...(r.tags ?? []), 'word-match'] }))
}

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

  let dictObj: CheatDict | null = typeof dict === 'string' ? await loadCheatDict(dict) : dict
  if (!dictObj || !norm) {
    if (useCache) queryCache.set(cacheKey, null)
    return null
  }

  const { exactIndex, phraseIndex, wordIndex } = getOrBuildIndex(dictObj)
  let result: CheatTranslation[] | null = null

  if (mode === 'exact' || mode === 'hybrid') {
    const ids = exactIndex.get(norm)
    if (ids?.length) result = formatResults(dictObj.items[ids[0]]?.targets?.[targetLang])
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
  dicts.filter(Boolean).forEach(d => getOrBuildIndex(d!))
}

export function clearCache(lang?: string, version?: string): void {
  if (lang && version) dictIndexCache.delete(`${lang}@${version}`)
  else if (lang) {
    for (const k of dictIndexCache.keys()) if (k.startsWith(`${lang}@`)) dictIndexCache.delete(k)
  } else dictIndexCache.clear()
  queryCache.clear()
  normalizeCache.clear()
                        }

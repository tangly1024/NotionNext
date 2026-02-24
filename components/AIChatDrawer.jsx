>import React, { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react'
>import { Dialog, Menu, Transition } from '@headlessui/react'
>const SUPPORTED_LANGUAGES = [
>  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
>  { code: 'en-US', name: 'English', flag: '🇺🇸' },
>  { code: 'my-MM', name: '缅甸语', flag: '🇲🇲' },
>  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
>  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
>  { code: 'vi-VN', name: '越南语', flag: '🇻🇳' },
>  { code: 'th-TH', name: '泰语', flag: '🇹🇭' },
>  { code: 'ms-MY', name: '马来语', flag: '🇲🇾' },
>  { code: 'id-ID', name: '印尼语', flag: '🇮🇩' },
>  { code: 'tl-PH', name: '菲律宾语', flag: '🇵🇭' },
>  { code: 'hi-IN', name: '印地语', flag: '🇮🇳' },
>  { code: 'ar-SA', name: '阿拉伯语', flag: '🇸🇦' },
>  { code: 'lo-LA', name: '老挝语', flag: '🇱🇦' },
>  { code: 'ru-RU', name: '俄语', flag: '🇷🇺' },
>  { code: 'km-KH', name: '柬埔寨语', flag: '🇰🇭' },
>  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
>  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
>  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
>  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' }
>]
>const DEFAULT_PROVIDERS = [{ id: 'p1', name: '默认接口', url: 'https://api.openai.com/v1', key: '' }]
>const DEFAULT_MODELS = [
>  { id: 'm1', providerId: 'p1', name: 'GPT-4o-mini', value: 'gpt-4o-mini' },
>  { id: 'm2', providerId: 'p1', name: 'GPT-4o', value: 'gpt-4o' }
>]
>const DEFAULT_SETTINGS = {
>  providers: DEFAULT_PROVIDERS,
>  models: DEFAULT_MODELS,
>  mainModelId: 'm1',
>  secondModelId: null,
>  followUpModelId: 'm1',
>  filterThinking: true,
>  enableFollowUp: true,
>  autoPlayTTS: false,
>  ttsSpeed: 1,
>  lastSourceLang: 'zh-CN',
>  lastTargetLang: 'my-MM'
>}
>const BASE_SYSTEM_INSTRUCTION = `你是一位翻译助手。请将用户输入从源语言翻译到目标语言。
>要求：
>1) 忠实原文，不添加无关信息；
>2) 输出 JSON 对象，格式：{"data":[{"translation":"...","back_translation":"..."}]}；
>3) 不要 markdown，不要解释文字。`
>const REPLY_SYSTEM_INSTRUCTION = `你是聊天建议助手。基于上一句翻译，给出 3-6 条自然口语回复建议。
>只返回 JSON 数组字符串，例如：["好的","收到"]，不要 markdown。`
>const STORAGE_KEY = 'ai_translator_settings_v1'
>const GlobalStyles = () => (
>  <style>{`
>    .no-scrollbar::-webkit-scrollbar { display: none; }
>    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
>    .slim-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
>    .slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,.15); border-radius: 999px; }
>  `}</style>
>)
>const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
>const safeLocalStorageGet = key => {
>  if (typeof window === 'undefined') return null
>  return window.localStorage.getItem(key)
>}
>const safeLocalStorageSet = (key, value) => {
>  if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
>}
>const detectScript = text => {
>  if (!text) return null
>  if (/[\u1000-\u109F\uAA60-\uAA7F]+/.test(text)) return 'my-MM'
>  if (/[\u4e00-\u9fa5]+/.test(text)) return 'zh-CN'
>  if (/[\uac00-\ud7af]+/.test(text)) return 'ko-KR'
>  if (/[\u3040-\u30ff\u31f0-\u31ff]+/.test(text)) return 'ja-JP'
>  if (/[\u0E00-\u0E7F]+/.test(text)) return 'th-TH'
>  if (/[\u0400-\u04FF]+/.test(text)) return 'ru-RU'
>  if (/[\u0600-\u06FF]+/.test(text)) return 'ar-SA'
>  if (/[\u0900-\u097F]+/.test(text)) return 'hi-IN'
>  if (/^[\w\s,.?!'"()\-:;]+$/.test(text)) return 'en-US'
>  return null
>}
>const getLangName = code => SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code
>const getLangFlag = code => SUPPORTED_LANGUAGES.find(l => l.code === code)?.flag || '🌐'
>const parseJsonSafe = raw => {
>  try {
>    return JSON.parse(raw)
>  } catch {
>    return null
>  }
>}
>const normalizeTranslations = raw => {
>  if (!raw) return [{ translation: '无有效译文', back_translation: '' }]
>  const clean = typeof raw === 'string' ? raw.replace(/```json|```/gi, '').trim() : ''
>  const parsed = parseJsonSafe(clean)
>  if (parsed) {
>    const arr = Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : []
>    const valid = arr.filter(x => x && typeof x.translation === 'string' && x.translation.trim())
>    if (valid.length) return valid.slice(0, 4)
>  }
>  if (clean) return [{ translation: clean, back_translation: '' }]
>  return [{ translation: '无有效译文', back_translation: '' }]
>}
>const parseSuggestionArray = raw => {
>  if (!raw) return []
>  const clean = raw.replace(/```json|```/gi, '').trim()
>  const parsed = parseJsonSafe(clean)
>  if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 8)
>  return clean
>    .split('\n')
>    .map(x => x.replace(/^[\-\d\.\)\s]+/, '').trim())
>    .filter(Boolean)
>    .slice(0, 8)
>}
>const compressImage = file =>
>  new Promise(resolve => {
>    const reader = new FileReader()
>    reader.onload = e => {
>      const img = new Image()
>      img.onload = () => {
>        const maxWidth = 1280
>        let { width, height } = img
>        if (width > maxWidth) {
>          height = (height * maxWidth) / width
>          width = maxWidth
>        }
>        const canvas = document.createElement('canvas')
>        canvas.width = width
>        canvas.height = height
>        const ctx = canvas.getContext('2d')
>        ctx.drawImage(img, 0, 0, width, height)
>        resolve(canvas.toDataURL('image/jpeg', 0.7))
>      }
>      img.src = e.target.result
>    }
>    reader.readAsDataURL(file)
>  })
>const playTTS = (text, lang, speed = 1) => {
>  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
>  const utter = new SpeechSynthesisUtterance(text)
>  utter.lang = lang
>  utter.rate = speed
>  window.speechSynthesis.cancel()
>  window.speechSynthesis.speak(utter)
>}
>const ensureSettings = settings => {
>  const providers = settings.providers?.length ? settings.providers : DEFAULT_PROVIDERS
>  const models = settings.models?.length ? settings.models : DEFAULT_MODELS
>  const modelIds = new Set(models.map(m => m.id))
>  const mainModelId = modelIds.has(settings.mainModelId) ? settings.mainModelId : models[0].id
>  const followUpModelId = modelIds.has(settings.followUpModelId) ? settings.followUpModelId : mainModelId
>  const secondModelId = settings.secondModelId && modelIds.has(settings.secondModelId) ? settings.secondModelId : null
>  return {
>    ...DEFAULT_SETTINGS,
>    ...settings,
>    providers,
>    models,
>    mainModelId,
>    followUpModelId,
>    secondModelId
>  }
>}
>const TranslationCard = memo(({ data, onPlay }) => {
>  const [copied, setCopied] = useState(false)
>  const handleCopy = async () => {
>    try {
>      await navigator.clipboard.writeText(data.translation || '')
>      setCopied(true)
>      setTimeout(() => setCopied(false), 800)
>    } catch {}
>  }
>  return (
>    <div
>      className='relative mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:scale-[0.99]'
>      onClick={handleCopy}>
>      {copied && (
>        <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/5'>
>          <span className='rounded bg-black/70 px-2 py-1 text-xs text-white'>已复制</span>
>        </div>
>      )}
>      <div className='whitespace-pre-wrap break-words text-center text-[17px] font-medium text-gray-800'>
>        {data.translation}
>      </div>
>      {!!data.back_translation && (
>        <div className='mt-2 whitespace-pre-wrap break-words text-center text-xs text-gray-400'>
>          {data.back_translation}
>        </div>
>      )}
>      <button
>        className='absolute bottom-2 right-2 rounded bg-gray-50 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100'
>        onClick={e => {
>          e.stopPropagation()
>          onPlay()
>        }}>
>        朗读
>      </button>
>    </div>
>  )
>})
>const TranslationResultContainer = memo(({ item, targetLang, ttsSpeed }) => {
>  const hasDual = item.modelResults && item.modelResults.length > 1
>  const [idx, setIdx] = useState(0)
>  const touchX = useRef(null)
>  const active = hasDual ? item.modelResults[idx] : null
>  const data = hasDual ? active?.data || [] : item.results || []
>  const onTouchStart = e => {
>    if (!hasDual) return
>    touchX.current = e.targetTouches[0].clientX
>  }
>  const onTouchEnd = e => {
>    if (!hasDual || touchX.current === null) return
>    const diff = touchX.current - e.changedTouches[0].clientX
>    if (diff > 50) setIdx(p => (p + 1) % item.modelResults.length)
>    if (diff < -50) setIdx(p => (p - 1 + item.modelResults.length) % item.modelResults.length)
>    touchX.current = null
>  }
>  return (
>    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
>      {hasDual && (
>        <div className='mb-2 flex justify-center gap-1'>
>          {item.modelResults.map((m, i) => (
>            <button
>              key={m.modelName + i}
>              onClick={() => setIdx(i)}
>              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-pink-500' : 'w-2 bg-gray-200'}`}
>            />
>          ))}
>        </div>
>      )}
>      {hasDual && <div className='mb-1 text-center text-[10px] text-gray-400'>{active?.modelName}</div>}
>      {data.map((r, i) => (
>        <TranslationCard key={i} data={r} onPlay={() => playTTS(r.translation, targetLang, ttsSpeed)} />
>      ))}
>    </div>
>  )
>})
>const ReplyChips = ({ list, onClick }) => {
>  if (!list.length) return null
>  return (
>    <div className='mt-3'>
>      <div className='mb-2 text-center text-[10px] text-gray-400'>快捷回复建议</div>
>      <div className='no-scrollbar flex gap-2 overflow-x-auto pb-1'>
>        {list.map((x, i) => (
>          <button
>            key={`${x}-${i}`}
>            className='shrink-0 rounded-full border border-pink-100 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm'
>            onClick={() => onClick(x)}>
>            {x}
>          </button>
>        ))}
>      </div>
>    </div>
>  )
>}
>const LanguagePicker = ({ open, onClose, current, onSelect, title }) => (
>  <Dialog open={open} onClose={onClose} className='relative z-[10003]'>
>    <div className='fixed inset-0 bg-black/20 backdrop-blur-sm' />
>    <div className='fixed inset-0 flex items-center justify-center p-4'>
>      <Dialog.Panel className='slim-scrollbar max-h-[70vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-4 shadow-xl'>
>        <div className='mb-3 text-sm font-bold text-gray-700'>{title}</div>
>        <div className='grid grid-cols-2 gap-2'>
>          {SUPPORTED_LANGUAGES.map(l => (
>            <button
>              key={l.code}
>              className={`rounded-xl border p-3 text-left text-sm ${current === l.code ? 'border-pink-500 bg-pink-50' : 'border-gray-100'}`}
>              onClick={() => {
>                onSelect(l.code)
>                onClose()
>              }}>
>              <span className='mr-2'>{l.flag}</span>
>              {l.name}
>            </button>
>          ))}
>        </div>
>      </Dialog.Panel>
>    </div>
>  </Dialog>
>)
>const SettingsModal = ({ settings, onSave, onClose }) => {
>  const [local, setLocal] = useState(settings)
>  useEffect(() => setLocal(settings), [settings])
>  const addProvider = () =>
>    setLocal(prev => ({
>      ...prev,
>      providers: [...prev.providers, { id: nowId(), name: '新接口', url: '', key: '' }]
>    }))
>  const updateProvider = (id, field, value) =>
>    setLocal(prev => ({
>      ...prev,
>      providers: prev.providers.map(p => (p.id === id ? { ...p, [field]: value } : p))
>    }))
>  const deleteProvider = id => {
>    if (local.providers.length <= 1) return
>    setLocal(prev => ({
>      ...prev,
>      providers: prev.providers.filter(p => p.id !== id),
>      models: prev.models.filter(m => m.providerId !== id)
>    }))
>  }
>  const addModel = providerId =>
>    setLocal(prev => ({
>      ...prev,
>      models: [...prev.models, { id: nowId(), providerId, name: '新模型', value: '' }]
>    }))
>  const updateModel = (id, field, value) =>
>    setLocal(prev => ({
>      ...prev,
>      models: prev.models.map(m => (m.id === id ? { ...m, [field]: value } : m))
>    }))
>  const deleteModel = id =>
>    setLocal(prev => ({
>      ...prev,
>      models: prev.models.filter(m => m.id !== id)
>    }))
>  const modelOptions = useMemo(
>    () => local.models.map(m => ({ id: m.id, label: `${m.name} (${m.value})` })),
>    [local.models]
>  )
>  return (
>    <Dialog open={true} onClose={onClose} className='relative z-[10002]'>
>      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
>      <div className='fixed inset-0 flex items-center justify-center p-4'>
>        <Dialog.Panel className='flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
>          <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4'>
>            <div className='font-bold text-gray-800'>接口与模型设置</div>
>            <button onClick={onClose} className='rounded-lg bg-gray-100 px-2 py-1 text-sm'>
>              关闭
>            </button>
>          </div>
>          <div className='slim-scrollbar flex-1 overflow-y-auto p-5'>
>            <div className='mb-6 rounded-xl bg-gray-50 p-4'>
>              <div className='mb-3 text-sm font-bold text-gray-700'>模型分配</div>
>              <div className='grid gap-3 md:grid-cols-3'>
>                <label className='text-xs text-gray-600'>
>                  主翻译模型
>                  <select
>                    className='mt-1 w-full rounded border p-2 text-xs'
>                    value={local.mainModelId || ''}
>                    onChange={e => setLocal(prev => ({ ...prev, mainModelId: e.target.value }))}>
>                    {modelOptions.map(o => (
>                      <option key={o.id} value={o.id}>
>                        {o.label}
>                      </option>
>                    ))}
>                  </select>
>                </label>
>                <label className='text-xs text-gray-600'>
>                  对比模型
>                  <select
>                    className='mt-1 w-full rounded border p-2 text-xs'
>                    value={local.secondModelId || ''}
>                    onChange={e =>
>                      setLocal(prev => ({ ...prev, secondModelId: e.target.value || null }))
>                    }>
>                    <option value=''>不启用</option>
>                    {modelOptions.map(o => (
>                      <option key={o.id} value={o.id}>
>                        {o.label}
>                      </option>
>                    ))}
>                  </select>
>                </label>
>                <label className='text-xs text-gray-600'>
>                  追问模型
>                  <select
>                    className='mt-1 w-full rounded border p-2 text-xs'
>                    value={local.followUpModelId || ''}
>                    onChange={e => setLocal(prev => ({ ...prev, followUpModelId: e.target.value }))}>
>                    {modelOptions.map(o => (
>                      <option key={o.id} value={o.id}>
>                        {o.label}
>                      </option>
>                    ))}
>                  </select>
>                </label>
>              </div>
>              <div className='mt-4 grid gap-3 md:grid-cols-3'>
>                <label className='flex items-center gap-2 text-xs text-gray-700'>
>                  <input
>                    type='checkbox'
>                    checked={!!local.filterThinking}
>                    onChange={e => setLocal(prev => ({ ...prev, filterThinking: e.target.checked }))}
>                  />
>                  过滤 &lt;think&gt;
>                </label>
>                <label className='flex items-center gap-2 text-xs text-gray-700'>
>                  <input
>                    type='checkbox'
>                    checked={!!local.enableFollowUp}
>                    onChange={e => setLocal(prev => ({ ...prev, enableFollowUp: e.target.checked }))}
>                  />
>                  启用追问建议
>                </label>
>                <label className='flex items-center gap-2 text-xs text-gray-700'>
>                  <input
>                    type='checkbox'
>                    checked={!!local.autoPlayTTS}
>                    onChange={e => setLocal(prev => ({ ...prev, autoPlayTTS: e.target.checked }))}
>                  />
>                  自动朗读
>                </label>
>              </div>
>            </div>
>            <div className='space-y-4'>
>              {local.providers.map(p => (
>                <div key={p.id} className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
>                  <div className='mb-2 flex items-center justify-between'>
>                    <input
>                      className='w-40 rounded border bg-white px-2 py-1 text-sm font-bold'
>                      value={p.name}
>                      onChange={e => updateProvider(p.id, 'name', e.target.value)}
>                    />
>                    <button className='text-xs text-red-500' onClick={() => deleteProvider(p.id)}>
>                      删除接口
>                    </button>
>                  </div>
>                  <div className='grid gap-2 md:grid-cols-2'>
>                    <input
>                      className='rounded border bg-white p-2 text-xs'
>                      placeholder='Base URL，例如 https://api.openai.com/v1'
>                      value={p.url}
>                      onChange={e => updateProvider(p.id, 'url', e.target.value)}
>                    />
>                    <input
>                      className='rounded border bg-white p-2 text-xs'
>                      type='password'
>                      placeholder='API Key'
>                      value={p.key}
>                      onChange={e => updateProvider(p.id, 'key', e.target.value)}
>                    />
>                  </div>
>                  <div className='mt-3 rounded-lg border border-gray-200 bg-white p-2'>
>                    <div className='mb-2 flex items-center justify-between'>
>                      <div className='text-[11px] font-bold text-gray-500'>模型列表</div>
>                      <button
>                        className='rounded bg-blue-50 px-2 py-1 text-[11px] text-blue-600'
>                        onClick={() => addModel(p.id)}>
>                        + 添加模型
>                      </button>
>                    </div>
>                    {local.models
>                      .filter(m => m.providerId === p.id)
>                      .map(m => (
>                        <div key={m.id} className='mb-2 grid gap-2 md:grid-cols-3'>
>                          <input
>                            className='rounded border p-2 text-xs'
>                            placeholder='显示名'
>                            value={m.name}
>                            onChange={e => updateModel(m.id, 'name', e.target.value)}
>                          />
>                          <input
>                            className='rounded border p-2 font-mono text-xs'
>                            placeholder='模型值，如 gpt-4o'
>                            value={m.value}
>                            onChange={e => updateModel(m.id, 'value', e.target.value)}
>                          />
>                          <button
>                            className='rounded bg-red-50 px-2 text-xs text-red-500'
>                            onClick={() => deleteModel(m.id)}>
>                            删除
>                          </button>
>                        </div>
>                      ))}
>                  </div>
>                </div>
>              ))}
>            </div>
>            <button
>              className='mt-4 w-full rounded-xl border border-dashed border-gray-300 py-2 text-sm text-gray-500'
>              onClick={addProvider}>
>              + 添加接口
>            </button>
>          </div>
>          <div className='flex justify-end gap-2 border-t border-gray-100 p-4'>
>            <button className='rounded-xl bg-gray-100 px-5 py-2 text-sm font-bold' onClick={onClose}>
>              取消
>            </button>
>            <button
>              className='rounded-xl bg-pink-500 px-5 py-2 text-sm font-bold text-white'
>              onClick={() => {
>                onSave(ensureSettings(local))
>                onClose()
>              }}>
>              保存
>            </button>
>          </div>
>        </Dialog.Panel>
>      </div>
>    </Dialog>
>  )
>}
>const AiChatContent = ({ onClose }) => {
>  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
>  const [sourceLang, setSourceLang] = useState('zh-CN')
>  const [targetLang, setTargetLang] = useState('my-MM')
>  const [inputVal, setInputVal] = useState('')
>  const [inputImages, setInputImages] = useState([])
>  const [history, setHistory] = useState([])
>  const [suggestions, setSuggestions] = useState([])
>  const [isLoading, setIsLoading] = useState(false)
>  const [isSuggesting, setIsSuggesting] = useState(false)
>  const [isRecording, setIsRecording] = useState(false)
>  const [showSettings, setShowSettings] = useState(false)
>  const [showSrcPicker, setShowSrcPicker] = useState(false)
>  const [showTgtPicker, setShowTgtPicker] = useState(false)
>  const fileInputRef = useRef(null)
>  const cameraInputRef = useRef(null)
>  const recognitionRef = useRef(null)
>  const scrollRef = useRef(null)
>  useEffect(() => {
>    const raw = safeLocalStorageGet(STORAGE_KEY)
>    if (!raw) return
>    try {
>      const parsed = ensureSettings(JSON.parse(raw))
>      setSettings(parsed)
>      setSourceLang(parsed.lastSourceLang || 'zh-CN')
>      setTargetLang(parsed.lastTargetLang || 'my-MM')
>    } catch {}
>  }, [])
>  useEffect(() => {
>    safeLocalStorageSet(
>      STORAGE_KEY,
>      JSON.stringify({
>        ...settings,
>        lastSourceLang: sourceLang,
>        lastTargetLang: targetLang
>      })
>    )
>  }, [settings, sourceLang, targetLang])
>  useEffect(() => {
>    return () => {
>      if (recognitionRef.current) {
>        try {
>          recognitionRef.current.stop()
>        } catch {}
>      }
>    }
>  }, [])
>  const scrollToBottom = () => {
>    setTimeout(() => {
>      if (!scrollRef.current) return
>      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
>    }, 100)
>  }
>  const getProviderAndModel = modelId => {
>    const model = settings.models.find(m => m.id === modelId)
>    if (!model) return null
>    const provider = settings.providers.find(p => p.id === model.providerId)
>    if (!provider) return null
>    return { model, provider }
>  }
>  const requestCompletion = async (endpoint, headers, body) => {
>    const res = await fetch(endpoint, {
>      method: 'POST',
>      headers,
>      body: JSON.stringify(body)
>    })
>    const text = await res.text()
>    const parsed = parseJsonSafe(text)
>    if (!res.ok) {
>      const msg = parsed?.error?.message || text || `API Error ${res.status}`
>      throw new Error(msg)
>    }
>    const content = parsed?.choices?.[0]?.message?.content
>    if (typeof content !== 'string') throw new Error('API 返回格式异常')
>    return content
>  }
>  const fetchAi = async (messages, modelId, jsonMode = true) => {
>    const pm = getProviderAndModel(modelId)
>    if (!pm) throw new Error('模型未配置')
>    if (!pm.provider.url) throw new Error(`${pm.provider.name} 缺少 URL`)
>    if (!pm.provider.key) throw new Error(`${pm.provider.name} 缺少 API Key`)
>    const endpoint = `${pm.provider.url.replace(/\/$/, '')}/chat/completions`
>    const headers = {
>      'Content-Type': 'application/json',
>      Authorization: `Bearer ${pm.provider.key}`
>    }
>    const body = {
>      model: pm.model.value,
>      messages,
>      stream: false,
>      temperature: 0.2
>    }
>    if (jsonMode) body.response_format = { type: 'json_object' }
>    try {
>      let content = await requestCompletion(endpoint, headers, body)
>      if (settings.filterThinking) {
>        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
>      }
>      return { content, modelName: pm.model.name }
>    } catch (e) {
>      const msg = String(e?.message || '')
>      if (jsonMode && /response_format|json_object|unsupported|invalid/i.test(msg)) {
>        const fallbackBody = { ...body }
>        delete fallbackBody.response_format
>        let content = await requestCompletion(endpoint, headers, fallbackBody)
>        if (settings.filterThinking) {
>          content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
>        }
>        return { content, modelName: pm.model.name }
>      }
>      throw e
>    }
>  }
>  const fetchSuggestions = async (originalText, src, tgt) => {
>    setIsSuggesting(true)
>    try {
>      const prompt = `原文(${getLangName(src)}): ${originalText}\n目标语言: ${getLangName(tgt)}`
>      const { content } = await fetchAi(
>        [
>          { role: 'system', content: REPLY_SYSTEM_INSTRUCTION },
>          { role: 'user', content: prompt }
>        ],
>        settings.followUpModelId,
>        false
>      )
>      setSuggestions(parseSuggestionArray(content))
>    } catch {
>      setSuggestions([])
>    } finally {
>      setIsSuggesting(false)
>    }
>  }
>  const handleTranslate = async textOverride => {
>    const text = (textOverride ?? inputVal).trim()
>    if (!text && inputImages.length === 0) return
>    let currentSource = sourceLang
>    let currentTarget = targetLang
>    if (text) {
>      const detected = detectScript(text)
>      if (detected && detected !== currentSource && detected === currentTarget) {
>        currentSource = targetLang
>        currentTarget = sourceLang
>        setSourceLang(currentSource)
>        setTargetLang(currentTarget)
>      } else if (detected && detected !== currentSource && detected !== 'en-US') {
>        currentSource = detected
>        setSourceLang(detected)
>      }
>    }
>    setIsLoading(true)
>    setSuggestions([])
>    const userMsg = {
>      id: nowId(),
>      role: 'user',
>      text,
>      images: inputImages,
>      ts: Date.now()
>    }
>    setHistory([userMsg])
>    setInputVal('')
>    setInputImages([])
>    scrollToBottom()
>    try {
>      const sysPrompt =
>        `${BASE_SYSTEM_INSTRUCTION}\n` +
>        `source=${getLangName(currentSource)} target=${getLangName(currentTarget)}\n` +
>        `back_translation 用 ${getLangName(currentSource)}`
>      const userPrompt = `Source: ${getLangName(currentSource)}\nTarget: ${getLangName(currentTarget)}\nContent:\n${text || '[Image Content]'}`
>      const userContent =
>        userMsg.images?.length > 0
>          ? [
>              { type: 'text', text: userPrompt },
>              ...userMsg.images.map(img => ({ type: 'image_url', image_url: { url: img } }))
>            ]
>          : userPrompt
>      const messages = [
>        { role: 'system', content: sysPrompt },
>        { role: 'user', content: userContent }
>      ]
>      const jobs = [
>        fetchAi(messages, settings.mainModelId, true)
>          .then(r => ({ ...r, ok: true }))
>          .catch(e => ({ ok: false, error: e.message }))
>      ]
>      if (settings.secondModelId && settings.secondModelId !== settings.mainModelId) {
>        jobs.push(
>          fetchAi(messages, settings.secondModelId, true)
>            .then(r => ({ ...r, ok: true }))
>            .catch(e => ({ ok: false, error: e.message }))
>        )
>      }
>      const list = await Promise.all(jobs)
>      const modelResults = list.map(x => {
>        if (!x.ok) {
>          return {
>            modelName: 'Error',
>            data: [{ translation: x.error || '请求失败', back_translation: '' }]
>          }
>        }
>        return { modelName: x.modelName, data: normalizeTranslations(x.content) }
>      })
>      const aiMsg = {
>        id: nowId(),
>        role: 'ai',
>        ts: Date.now(),
>        modelResults,
>        results: modelResults[0]?.data || [{ translation: '无结果', back_translation: '' }]
>      }
>      setHistory(prev => [...prev, aiMsg])
>      scrollToBottom()
>      if (settings.autoPlayTTS && aiMsg.results[0]?.translation) {
>        playTTS(aiMsg.results[0].translation, currentTarget, settings.ttsSpeed)
>      }
>      if (settings.enableFollowUp && text) {
>        fetchSuggestions(text, currentSource, currentTarget)
>      }
>    } catch (e) {
>      setHistory(prev => [
>        ...prev,
>        { id: nowId(), role: 'error', text: e.message || '请求失败' }
>      ])
>    } finally {
>      setIsLoading(false)
>    }
>  }
>  const handleImageSelect = async e => {
>    const files = Array.from(e.target.files || [])
>    if (!files.length) return
>    const list = []
>    for (const file of files) {
>      try {
>        const b64 = await compressImage(file)
>        list.push(b64)
>      } catch {}
>    }
>    setInputImages(prev => [...prev, ...list])
>    e.target.value = ''
>  }
>  const stopRecognition = () => {
>    if (!recognitionRef.current) return
>    try {
>      recognitionRef.current.stop()
>    } catch {}
>  }
>  const startRecognition = () => {
>    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
>    if (!SR) {
>      alert('当前浏览器不支持语音识别')
>      return
>    }
>    if (isRecording) {
>      stopRecognition()
>      return
>    }
>    const rec = new SR()
>    recognitionRef.current = rec
>    rec.lang = sourceLang
>    rec.interimResults = true
>    rec.continuous = false
>    setInputVal('')
>    setIsRecording(true)
>    rec.onresult = event => {
>      const text = Array.from(event.results)
>        .map(r => r[0]?.transcript || '')
>        .join('')
>      setInputVal(text)
>      const isFinal = Array.from(event.results).some(r => r.isFinal)
>      if (isFinal && text.trim()) {
>        try {
>          rec.stop()
>        } catch {}
>        setIsRecording(false)
>        handleTranslate(text.trim())
>      }
>    }
>    rec.onerror = () => setIsRecording(false)
>    rec.onend = () => {
>      setIsRecording(false)
>      recognitionRef.current = null
>    }
>    rec.start()
>  }
>  return (
>    <div className='relative flex h-[100dvh] w-full flex-col bg-[#FFF7FB] text-gray-800'>
>      <GlobalStyles />
>      <div className='z-20 border-b border-pink-100/70 bg-white/70 px-4 backdrop-blur'>
>        <div className='mx-auto flex h-12 w-full max-w-[680px] items-center justify-between'>
>          <button className='rounded-lg bg-gray-100 px-2 py-1 text-sm' onClick={onClose}>
>            返回
>          </button>
>          <div className='font-extrabold tracking-tight text-pink-600'>AI 翻译</div>
>          <button
>            className='rounded-lg bg-gray-100 px-2 py-1 text-sm'
>            onClick={() => setShowSettings(true)}>
>            设置
>          </button>
>        </div>
>      </div>
>      <Transition
>        show={isRecording}
>        as={Fragment}
>        enter='transition-opacity duration-200'
>        enterFrom='opacity-0'
>        enterTo='opacity-100'
>        leave='transition-opacity duration-150'
>        leaveFrom='opacity-100'
>        leaveTo='opacity-0'>
>        <div className='pointer-events-none fixed left-0 right-0 top-20 z-40 flex justify-center'>
>          <div className='rounded-full bg-pink-500/90 px-4 py-2 text-sm font-bold text-white shadow'>
>            正在识别（{getLangName(sourceLang)}）...
>          </div>
>        </div>
>      </Transition>
>      <div ref={scrollRef} className='no-scrollbar z-10 flex-1 overflow-y-auto px-4 pb-36 pt-4'>
>        <div className='mx-auto flex min-h-full w-full max-w-[680px] flex-col justify-end'>
>          {!history.length && !isLoading && (
>            <div className='mb-20 text-center text-sm text-gray-400'>
>              <div className='mb-1 text-3xl'>👋</div>
>              输入文字 / 语音 / 图片开始翻译
>            </div>
>          )}
>          {history.map((item, idx) => {
>            if (item.role === 'user') {
>              return (
>                <div key={item.id} className='mb-5 flex justify-end'>
>                  <div className='max-w-[85%]'>
>                    {!!item.images?.length && (
>                      <div className='mb-2 flex flex-wrap justify-end gap-1'>
>                        {item.images.map((img, i) => (
>                          <img
>                            key={i}
>                            src={img}
>                            alt='upload'
>                            className='h-20 w-20 rounded-lg border border-gray-200 object-cover'
>                          />
>                        ))}
>                      </div>
>                    )}
>                    {!!item.text && (
>                      <div className='rounded-2xl rounded-tr-sm bg-gray-200 px-4 py-2 text-sm text-gray-700'>
>                        {item.text}
>                      </div>
>                    )}
>                  </div>
>                </div>
>              )
>            }
>            if (item.role === 'error') {
>              return (
>                <div
>                  key={item.id}
>                  className='mb-5 rounded-xl bg-red-50 p-3 text-center text-xs text-red-500'>
>                  {item.text}
>                </div>
>              )
>            }
>            return (
>              <div key={item.id} className='mb-5'>
>                <TranslationResultContainer
>                  item={item}
>                  targetLang={targetLang}
>                  ttsSpeed={settings.ttsSpeed}
>                />
>                {idx === history.length - 1 &&
>                  (isSuggesting ? (
>                    <div className='py-2 text-center text-xs text-pink-400'>正在生成回复建议...</div>
>                  ) : (
>                    <ReplyChips
>                      list={suggestions}
>                      onClick={reply => {
>                        setInputVal(reply)
>                        handleTranslate(reply)
>                      }}
>                    />
>                  ))}
>              </div>
>            )
>          })}
>          {isLoading && (
>            <div className='mb-8 flex justify-center'>
>              <div className='rounded-2xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-pink-500 shadow'>
>                翻译中...
>              </div>
>            </div>
>          )}
>        </div>
>      </div>
>      <div className='fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-white/0 pb-[max(12px,env(safe-area-inset-bottom))] pt-6'>
>        <div className='mx-auto w-full max-w-[680px] px-4'>
>          <div className='relative mb-2 flex items-center justify-center'>
>            <div className='flex items-center gap-2 rounded-full border border-white/70 bg-white/50 p-1 shadow-sm backdrop-blur'>
>              <button
>                className='rounded-full px-3 py-1.5 text-xs font-bold'
>                onClick={() => setShowSrcPicker(true)}>
>                {getLangFlag(sourceLang)} {getLangName(sourceLang)}
>              </button>
>              <button
>                className='rounded-full bg-pink-50 px-2 py-1 text-xs text-pink-600'
>                onClick={() => {
>                  setSourceLang(targetLang)
>                  setTargetLang(sourceLang)
>                }}>
>                交换
>              </button>
>              <button
>                className='rounded-full px-3 py-1.5 text-xs font-bold'
>                onClick={() => setShowTgtPicker(true)}>
>                {getLangFlag(targetLang)} {getLangName(targetLang)}
>              </button>
>            </div>
>          </div>
>          <div className='flex items-end gap-2 rounded-[26px] border border-pink-100 bg-white p-1.5 shadow-sm'>
>            <Menu as='div' className='relative'>
>              <Menu.Button className='flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-pink-50'>
>                图
>              </Menu.Button>
>              <Transition
>                as={Fragment}
>                enter='transition duration-100 ease-out'
>                enterFrom='scale-95 opacity-0'
>                enterTo='scale-100 opacity-100'
>                leave='transition duration-75 ease-in'
>                leaveFrom='scale-100 opacity-100'
>                leaveTo='scale-95 opacity-0'>
>                <Menu.Items className='absolute bottom-full left-0 mb-2 w-28 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5'>
>                  <Menu.Item>
>                    {({ active }) => (
>                      <button
>                        className={`w-full rounded-lg px-2 py-2 text-left text-sm ${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'}`}
>                        onClick={() => cameraInputRef.current?.click()}>
>                        拍照
>                      </button>
>                    )}
>                  </Menu.Item>
>                  <Menu.Item>
>                    {({ active }) => (
>                      <button
>                        className={`w-full rounded-lg px-2 py-2 text-left text-sm ${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'}`}
>                        onClick={() => fileInputRef.current?.click()}>
>                        相册
>                      </button>
>                    )}
>                  </Menu.Item>
>                </Menu.Items>
>              </Transition>
>            </Menu>
>            <input
>              ref={fileInputRef}
>              type='file'
>              accept='image/*'
>              multiple
>              className='hidden'
>              onChange={handleImageSelect}
>            />
>            <input
>              ref={cameraInputRef}
>              type='file'
>              accept='image/*'
>              capture='environment'
>              className='hidden'
>              onChange={handleImageSelect}
>            />
>            <div className='flex min-h-[42px] flex-1 flex-col justify-center'>
>              {!!inputImages.length && (
>                <div className='no-scrollbar mb-1 flex gap-2 overflow-x-auto px-1'>
>                  {inputImages.map((img, idx) => (
>                    <div key={idx} className='relative shrink-0'>
>                      <img
>                        src={img}
>                        alt='preview'
>                        className='h-11 w-11 rounded border border-gray-200 object-cover'
>                      />
>                      <button
>                        className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white'
>                        onClick={() => setInputImages(prev => prev.filter((_, i) => i !== idx))}>
>                        x
>                      </button>
>                    </div>
>                  ))}
>                </div>
>              )}
>              <textarea
>                rows={1}
>                value={inputVal}
>                placeholder={isRecording ? '' : '输入内容...'}
>                onChange={e => setInputVal(e.target.value)}
>                onKeyDown={e => {
>                  if (e.key === 'Enter' && !e.shiftKey) {
>                    e.preventDefault()
>                    handleTranslate()
>                  }
>                }}
>                className='no-scrollbar max-h-28 w-full resize-none bg-transparent px-2 py-2 text-[16px] leading-6 text-gray-800 outline-none placeholder:text-gray-400'
>              />
>            </div>
>            <div className='mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center'>
>              {isRecording ? (
>                <button className='h-10 w-10 rounded-full bg-red-500 text-white shadow' onClick={stopRecognition}>
>                  停
>                </button>
>              ) : inputVal.trim() || inputImages.length ? (
>                <button
>                  className='h-10 w-10 rounded-full bg-pink-500 text-white shadow active:scale-90'
>                  onClick={() => handleTranslate()}>
>                  发
>                </button>
>              ) : (
>                <button
>                  className='h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600'
>                  onClick={startRecognition}>
>                  麦
>                </button>
>              )}
>            </div>
>          </div>
>        </div>
>      </div>
>      <LanguagePicker
>        open={showSrcPicker}
>        onClose={() => setShowSrcPicker(false)}
>        current={sourceLang}
>        onSelect={setSourceLang}
>        title='选择源语言'
>      />
>      <LanguagePicker
>        open={showTgtPicker}
>        onClose={() => setShowTgtPicker(false)}
>        current={targetLang}
>        onSelect={setTargetLang}
>        title='选择目标语言'
>      />
>      {showSettings && (
>        <SettingsModal
>          settings={settings}
>          onSave={setSettings}
>          onClose={() => setShowSettings(false)}
>        />
>      )}
>    </div>
>  )
>}
>const AIChatDrawer = ({ isOpen, onClose }) => {
>  return (
>    <Transition show={isOpen} as={Fragment}>
>      <Dialog as='div' className='relative z-[9999]' onClose={onClose}>
>        <Transition.Child
>          as={Fragment}
>          enter='ease-out duration-300'
>          enterFrom='opacity-0'
>          enterTo='opacity-100'
>          leave='ease-in duration-200'
>          leaveFrom='opacity-100'
>          leaveTo='opacity-0'>
>          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
>        </Transition.Child>
>        <div className='fixed inset-0 overflow-hidden'>
>          <div className='absolute inset-0 overflow-hidden'>
>            <Transition.Child
>              as={Fragment}
>              enter='transform transition ease-in-out duration-300'
>              enterFrom='translate-y-full'
>              enterTo='translate-y-0'
>              leave='transform transition ease-in-out duration-300'
>              leaveFrom='translate-y-0'
>              leaveTo='translate-y-full'>
>              <Dialog.Panel className='pointer-events-auto h-full w-screen'>
>                <AiChatContent onClose={onClose} />
>              </Dialog.Panel>
>            </Transition.Child>
>          </div>
>        </div>
>      </Dialog>
>    </Transition>
>  )
>}
>export default AIChatDrawer

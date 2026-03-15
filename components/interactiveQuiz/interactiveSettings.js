export const INTERACTIVE_PREFS_KEY = 'interactive_quiz_prefs_v1';
export const INTERACTIVE_AI_SETTINGS_KEY = 'interactive_quiz_ai_settings_v1';

export const DEFAULT_INTERACTIVE_PREFS = {
  // 选择题用
  showQuestionPinyin: true,
  showOptionPinyin: true,

  // 排序题用
  showPinyin: true,

  // 通用
  autoPlay: true,
  ttsSpeed: 'normal' // slow | normal | fast
};

export const DEFAULT_INTERACTIVE_AI_SETTINGS = {
  // LLM
  apiUrl: '',
  apiKey: '',
  model: 'mistral-large-2512',
  temperature: 0.2,

  // 当前互动题最终会优先用这里的 systemPrompt
  systemPrompt:
    '你是一位互动题解析老师。请根据题目、选项、学生答案和正确答案，用简洁中文解释为什么对或错。不要太长，不要输出 Markdown。',

  // TTS
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  myVoice: 'my-MM-ThihaNeural',
  ttsSpeed: -10,
  ttsPitch: 0,

  // 交互体验
  soundFx: true,
  vibration: true,
  showText: true,
  asrSilenceMs: 1500
};

function safeParse(json, fallback) {
  try {
    if (!json) return fallback;
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function safeGetStorageItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorageItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function getSavedInteractivePrefs() {
  const raw = safeGetStorageItem(INTERACTIVE_PREFS_KEY);
  const parsed = safeParse(raw, {});
  return {
    ...DEFAULT_INTERACTIVE_PREFS,
    ...(parsed || {})
  };
}

export function saveInteractivePrefs(nextPrefs) {
  const merged = {
    ...DEFAULT_INTERACTIVE_PREFS,
    ...(nextPrefs || {})
  };
  safeSetStorageItem(INTERACTIVE_PREFS_KEY, JSON.stringify(merged));
}

export function getSavedInteractiveAISettings() {
  const raw = safeGetStorageItem(INTERACTIVE_AI_SETTINGS_KEY);
  const parsed = safeParse(raw, {});
  return {
    ...DEFAULT_INTERACTIVE_AI_SETTINGS,
    ...(parsed || {})
  };
}

export function saveInteractiveAISettings(nextSettings) {
  const merged = {
    ...DEFAULT_INTERACTIVE_AI_SETTINGS,
    ...(nextSettings || {})
  };
  safeSetStorageItem(INTERACTIVE_AI_SETTINGS_KEY, JSON.stringify(merged));
}

export function resetInteractivePrefs() {
  saveInteractivePrefs(DEFAULT_INTERACTIVE_PREFS);
  return { ...DEFAULT_INTERACTIVE_PREFS };
}

export function resetInteractiveAISettings() {
  saveInteractiveAISettings(DEFAULT_INTERACTIVE_AI_SETTINGS);
  return { ...DEFAULT_INTERACTIVE_AI_SETTINGS };
}

/**
 * 把 slow / normal / fast 映射成你排序题 TTS 那边要的播放倍速
 * 目前按你现有代码：
 * slow   -> 0.75
 * normal -> 1.0
 * fast   -> 1.15
 */
export function speedLabelToPlayback(label = 'normal') {
  if (label === 'slow') return 0.75;
  if (label === 'fast') return 1.15;
  return 1.0;
}

/**
 * 把 slow / normal / fast 映射成选择题 TTS 那边用的 rate 数值
 * 如果你后面想统一，也可以直接复用这个。
 */
export function speedLabelToRate(label = 'normal') {
  if (label === 'slow') return -30;
  if (label === 'fast') return 20;
  return 0;
}

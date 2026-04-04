export const INTERACTIVE_PREFS_KEY = 'interactive_quiz_prefs_v2';
export const INTERACTIVE_AI_SETTINGS_KEY = 'interactive_quiz_ai_settings_v2';

export const PROVIDERS = [
  {
    id: 'mistral',
    name: 'Mistral',
    icon: '🟠',
    apiUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-2512', 'mistral-small-latest', 'open-mistral-nemo']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    apiUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔵',
    apiUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🟣',
    apiUrl: 'https://openrouter.ai/api/v1',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'deepseek/deepseek-chat',
      'mistralai/mistral-small-3.1-24b-instruct'
    ]
  },
  {
    id: 'custom',
    name: '自定义',
    icon: '⚙️',
    apiUrl: '',
    models: [],
    allowCustomApiUrl: true,
    allowCustomModel: true
  }
];

export const EXERCISE_ASSISTANTS = [
  {
    id: 'exercise_patient',
    name: '耐心讲题老师',
    icon: '📘',
    prompt:
      '你是一位互动题解析老师。请像耐心老师一样讲解。先用简洁中文说考点，再用缅文补充解释。不要输出 Markdown。先解释为什么对或错，再指出学生最容易误解的地方，最后鼓励学生继续提问或跟读。'
  },
  {
    id: 'exercise_exam',
    name: '考点拆解老师',
    icon: '🎯',
    prompt:
      '你是一位互动题考点拆解老师。请直接指出这题考什么、正确答案为什么对、错误答案为什么错。核心表达用中文，细节解释可用缅文辅助。回答短一点，逻辑清楚，不要输出 Markdown。'
  },
  {
    id: 'exercise_duolingo',
    name: '闯关陪练老师',
    icon: '🧩',
    prompt:
      '你是一位多邻国风格互动题老师。请用轻松但清楚的方式讲解题目。先讲考点，再讲正确答案逻辑。如果学生答错，要站在学生角度解释为什么会选错。中文为主，缅文辅助，不要输出 Markdown。'
  }
];

export const DEFAULT_INTERACTIVE_PREFS = {
  // 选择题
  showQuestionPinyin: true,
  showOptionPinyin: true,

  // 排序题
  showPinyin: true,

  // 通用
  autoPlay: true,
  ttsSpeed: 'normal' // slow | normal | fast
};

const DEFAULT_PROVIDER = PROVIDERS[0];
const DEFAULT_ASSISTANT = EXERCISE_ASSISTANTS[0];

export const DEFAULT_INTERACTIVE_AI_SETTINGS = {
  providerId: DEFAULT_PROVIDER.id,
  apiUrl: DEFAULT_PROVIDER.apiUrl,
  apiKey: '',
  model: DEFAULT_PROVIDER.models[0],

  assistantId: DEFAULT_ASSISTANT.id,
  systemPrompt: DEFAULT_ASSISTANT.prompt,

  temperature: 0.2,

  ttsApiUrl: 'https://t.leftsite.cn/tts',
  zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  myVoice: 'my-MM-ThihaNeural',
  ttsSpeed: -10,
  ttsPitch: 0,

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

export function getProviderById(providerId) {
  return PROVIDERS.find((p) => p.id === providerId) || DEFAULT_PROVIDER;
}

export function getDefaultModelByProvider(providerId) {
  const provider = getProviderById(providerId);
  return provider.models?.[0] || '';
}

export function getExerciseAssistantById(assistantId) {
  return EXERCISE_ASSISTANTS.find((a) => a.id === assistantId) || DEFAULT_ASSISTANT;
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

export function normalizeInteractiveAISettings(nextSettings = {}) {
  const merged = {
    ...DEFAULT_INTERACTIVE_AI_SETTINGS,
    ...(nextSettings || {})
  };

  const provider = getProviderById(merged.providerId);

  if (!merged.apiUrl && !provider.allowCustomApiUrl) {
    merged.apiUrl = provider.apiUrl;
  }

  if (!merged.model) {
    merged.model = getDefaultModelByProvider(merged.providerId);
  }

  if (!merged.systemPrompt) {
    merged.systemPrompt = getExerciseAssistantById(merged.assistantId).prompt;
  }

  return merged;
}

export function getSavedInteractiveAISettings() {
  const raw = safeGetStorageItem(INTERACTIVE_AI_SETTINGS_KEY);
  const parsed = safeParse(raw, {});
  return normalizeInteractiveAISettings(parsed || {});
}

export function saveInteractiveAISettings(nextSettings) {
  const merged = normalizeInteractiveAISettings(nextSettings || {});
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

export function speedLabelToPlayback(label = 'normal') {
  if (label === 'slow') return 0.75;
  if (label === 'fast') return 1.15;
  return 1.0;
}

export function speedLabelToRate(label = 'normal') {
  if (label === 'slow') return -30;
  if (label === 'fast') return 20;
  return 0;
}

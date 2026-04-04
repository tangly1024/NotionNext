import { getProviderById } from './aiProviders';
import {
  AI_SCENES,
  getAssistantById,
  getDefaultAssistantIdByScene
} from './aiAssistants';

export const AI_SETTINGS_KEY = 'ai_tutor_settings_v8';
export const AI_REC_LANG_KEY = 'ai_tutor_rec_lang_v3';

export const SCENE_LABELS = {
  [AI_SCENES.ORAL]: 'AI练口语',
  [AI_SCENES.EXERCISE]: '互动题讲解'
};

export const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'my-MM', name: 'မြန်မာ (缅语)', flag: '🇲🇲' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' }
];

export const TTS_VOICES = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓多语言 (女-推荐)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰多语言 (男-推荐)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (女-标准)' },
  { id: 'zh-CN-YunxiNeural', name: '云希 (男-阳光)' },
  { id: 'zh-CN-YunjianNeural', name: '云健 (男-影视)' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊 (女-亲切)' }
];

export const toFinite = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const defaultProvider = getProviderById('mistral');
const oralAssistant = getAssistantById(getDefaultAssistantIdByScene(AI_SCENES.ORAL));
const exerciseAssistant = getAssistantById(getDefaultAssistantIdByScene(AI_SCENES.EXERCISE));

export const DEFAULT_SETTINGS = {
  shared: {
    providerId: defaultProvider.id,
    apiUrl: defaultProvider.baseUrl,
    apiKey: '',
    model: defaultProvider.models?.[0] || '',
    ttsApiUrl: 'https://t.leftsite.cn/tts',
    ttsVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
    ttsSpeed: -25,
    ttsPitch: 0
  },
  scenes: {
    [AI_SCENES.ORAL]: {
      assistantId: oralAssistant.id,
      systemPrompt: oralAssistant.prompt,
      temperature: 0.7,
      showText: true,
      asrSilenceMs: 1500
    },
    [AI_SCENES.EXERCISE]: {
      assistantId: exerciseAssistant.id,
      systemPrompt: exerciseAssistant.prompt,
      temperature: 0.45,
      showText: true,
      asrSilenceMs: 1800
    }
  }
};

export function mergeDeep(base, patch) {
  if (Array.isArray(base)) return patch ?? base;
  if (typeof base !== 'object' || base === null) return patch ?? base;

  const output = { ...base };
  for (const key of Object.keys(patch || {})) {
    output[key] = mergeDeep(base?.[key], patch[key]);
  }
  return output;
}

export function resolveSceneSettings(allSettings = DEFAULT_SETTINGS, scene = AI_SCENES.ORAL) {
  const merged = mergeDeep(DEFAULT_SETTINGS, allSettings || {});
  const shared = merged.shared || DEFAULT_SETTINGS.shared;
  const scenePatch = merged.scenes?.[scene] || DEFAULT_SETTINGS.scenes[scene];

  return {
    scene,
    ...shared,
    ...scenePatch
  };
}

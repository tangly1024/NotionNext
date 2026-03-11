// 文件路径: src/data/ai-models.js

export const PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://www.galaapi.com/v1',
    models: ['gemini-3.1-flash-lite-preview', 'gemini-2.5-flash-lite'],
  },
  Mistral: {
    id: 'Mistral',
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-2512', 'mistral-medium-latest'],
  },
  nvidia: {
    id: 'nvidia',
    name: 'NVIDIA',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: ['qwen/qwen3.5-397b-a17b', 'mistralai/mistral-large-3-675b-instruct-2512'],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
  },
  iflow: {
    id: 'iflow',
    name: 'iflow',
    baseUrl: 'https://apis.iflow.cn/v1',
    models: ['qwen3-max', 'qwen3-235b'],
  },
  qwen: {
    id: 'qwen',
    name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-max', 'qwen-plus'],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite'],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['google/gemini-2.0-flash-001', 'deepseek/deepseek-chat'],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    baseUrl: '',
    models: ['gpt-4o-mini'],
  },
};

// 专属密钥路由，可选
const KEY_ROUTER = {
  "sk-vip-super-admin-999": {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini'],
    name: 'VIP 极速节点'
  },
  "sk-pro-translate-888": {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
    name: 'Pro 翻译节点'
  }
};

export const DEFAULT_PROVIDER = 'openai';

export const getProviderMeta = (providerId) => {
  return PROVIDERS[providerId] || PROVIDERS[DEFAULT_PROVIDER];
};

export const getApiConfig = ({ apiKey, provider, customBaseUrl, customModels }) => {
  const cleanKey = (apiKey || '').trim();
  const cleanProvider = provider || DEFAULT_PROVIDER;

  // 专属 key 优先
  if (cleanKey && KEY_ROUTER[cleanKey]) {
    return {
      ...KEY_ROUTER[cleanKey],
      apiKey: cleanKey
    };
  }

  const providerMeta = getProviderMeta(cleanProvider);

  const finalBaseUrl =
    cleanProvider === 'custom'
      ? (customBaseUrl || '').trim()
      : providerMeta.baseUrl;

  let finalModels = providerMeta.models;
  if (cleanProvider === 'custom' && customModels?.trim()) {
    finalModels = customModels
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  return {
    provider: cleanProvider,
    name: providerMeta.name,
    baseUrl: finalBaseUrl,
    models: finalModels,
    apiKey: cleanKey
  };
};

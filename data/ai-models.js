// 文件路径: src/data/ai-models.js

export const PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: 'fa-brain',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini'],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'fa-globe', // 用地球/水相关的图标代表
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
  },
  qwen: {
    id: 'qwen',
    name: '通义千问',
    icon: 'fa-cloud',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-max', 'qwen-plus'],
  },
  nvidia: {
    id: 'nvidia',
    name: 'NVIDIA',
    icon: 'fa-microchip',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: ['meta/llama-3.1-70b-instruct', 'google/gemma-2-9b-it'],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    icon: 'fa-sparkles',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite'],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: 'fa-network-wired',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['google/gemini-2.0-flash-001', 'deepseek/deepseek-chat'],
  },
  custom: {
    id: 'custom',
    name: '自定义',
    icon: 'fa-sliders-h',
    baseUrl: '',
    models: ['gpt-4o-mini'],
  },
};

const KEY_ROUTER = {
  'sk-vip-super-admin-999': {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini'],
    name: 'VIP 极速节点',
    icon: 'fa-crown',
  },
  'sk-pro-translate-888': {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
    name: 'Pro 翻译节点',
    icon: 'fa-bolt',
  },
};

export const DEFAULT_PROVIDER = 'openai';

export const getProviderMeta = (providerId) => {
  return PROVIDERS[providerId] || PROVIDERS[DEFAULT_PROVIDER];
};

// 注意：这里改成了接收 apiKeys 对象
export const getApiConfig = ({ apiKeys, provider, customBaseUrl, customModels }) => {
  const cleanProvider = provider || DEFAULT_PROVIDER;
  const providerMeta = getProviderMeta(cleanProvider);
  
  // 获取当前供应商对应的密钥
  const rawKey = apiKeys?.[cleanProvider] || '';
  const cleanKey = rawKey.trim();

  // 1. 如果匹配到超级路由密钥
  if (cleanKey && KEY_ROUTER[cleanKey]) {
    return {
      ...KEY_ROUTER[cleanKey],
      apiKey: cleanKey,
    };
  }

  // 2. 正常供应商逻辑
  const finalBaseUrl =
    cleanProvider === 'custom'
      ? (customBaseUrl || '').trim()
      : providerMeta.baseUrl;

  let finalModels = providerMeta.models;
  if (cleanProvider === 'custom' && customModels?.trim()) {
    finalModels = customModels
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return {
    provider: cleanProvider,
    name: providerMeta.name,
    icon: providerMeta.icon,
    baseUrl: finalBaseUrl,
    models: finalModels,
    apiKey: cleanKey,
  };
};

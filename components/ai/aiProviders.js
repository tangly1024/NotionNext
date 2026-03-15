export const AI_PROVIDERS = [
  {
    id: 'mistral',
    name: 'Mistral',
    shortName: 'MI',
    logoUrl: '/ai/providers/mistral.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-small-latest'],
    allowCustomModel: true,
    allowCustomBaseUrl: true
  },
  {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'OA',
    logoUrl: '/ai/providers/openai.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4o'],
    allowCustomModel: true,
    allowCustomBaseUrl: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DS',
    logoUrl: '/ai/providers/deepseek.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    allowCustomModel: true,
    allowCustomBaseUrl: false
  },
  {
    id: 'groq',
    name: 'Groq',
    shortName: 'GQ',
    logoUrl: '/ai/providers/groq.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    allowCustomModel: true,
    allowCustomBaseUrl: false
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    shortName: 'OR',
    logoUrl: '/ai/providers/openrouter.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4.1-mini',
      'google/gemini-2.0-flash-001',
      'anthropic/claude-3.5-sonnet'
    ],
    allowCustomModel: true,
    allowCustomBaseUrl: false
  },
  {
    id: 'custom_openai',
    name: '自定义兼容服务',
    shortName: 'CU',
    logoUrl: '/ai/providers/custom.svg',
    protocol: 'openai-compatible',
    baseUrl: '',
    models: [],
    allowCustomModel: true,
    allowCustomBaseUrl: true
  }
];

export function getProviderById(providerId = '') {
  return AI_PROVIDERS.find((item) => item.id === providerId) || AI_PROVIDERS[0];
}

export function getProviderModels(providerId = '') {
  return getProviderById(providerId)?.models || [];
}

export function getProviderBaseUrl(providerId = '') {
  return getProviderById(providerId)?.baseUrl || '';
}

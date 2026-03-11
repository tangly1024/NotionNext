// 文件路径: data/ai-models.js (或者 src/data/ai-models.js 根据你的项目结构)

/**
 * 密钥路由映射表
 * 限制特定的 API Key 只能使用特定的接口和模型组
 */
const KEY_ROUTER = {
  // === 示例 1：高级节点 (优先用 4o，失败了用 claude，再失败用 deepseek) ===
  "sk-vip-super-admin-999": {
    baseUrl: "https://api.openai.com/v1", // 填你的高级代理或官方地址
    models: ["gpt-4o", "claude-3-5-sonnet", "deepseek-chat"], // 核心：数组格式，按顺序轮询！
    name: "VIP 极速节点"
  },
  
  // === 示例 2：中级节点 (只允许用特定的几个模型) ===
  "sk-pro-translate-888": {
    baseUrl: "https://apis.iflow.cn/v1",
    models: ["deepseek-chat", "qwen-max"], 
    name: "Pro 翻译节点"
  }
};

/**
 * 兜底配置 (如果前端填写的密钥不在上面列表里，就走这里)
 * 可以放最便宜的模型
 */
const DEFAULT_CONFIG = {
  baseUrl: "https://www.galaapi.com/v1", // 硅基流动或其他便宜接口
  models: ["gemini-2.5-flash-lite", "deepseek-ai/DeepSeek-V3"], 
  name: "基础通用节点"
};

/**
 * 解析并分发配置
 */
export const getApiConfig = (apiKey) => {
  const cleanKey = (apiKey || "").trim();
  
  // 如果没填密钥，返回默认
  if (!cleanKey) return { ...DEFAULT_CONFIG, apiKey: cleanKey };

  // 如果匹配到了专属密钥，返回专属配置
  const matchedConfig = KEY_ROUTER[cleanKey];
  if (matchedConfig) {
    return { ...matchedConfig, apiKey: cleanKey };
  }

  // 如果是普通散客密钥，走默认兜底
  return { ...DEFAULT_CONFIG, apiKey: cleanKey };
};

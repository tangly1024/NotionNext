// 文件路径: data/ai-models.js

/**
 * 密钥路由映射表
 * 逻辑：根据前端传入的 apiKey，决定调用哪个接口、哪个模型。
 */
const KEY_ROUTER = {
  // --- 高级测试密钥（VIP/测试用户） ---
  "sk-F3C8bkOTAlcJ6pvtkewVINZ3nQk48MBABo0MaK0MPLmtLv5t": {
    baseUrl: "https://www.galaapi.com/v1", // 官方或高优代理接口
    model: "gemini-2.5-flash-lite",                      // 高级模型
    name: "gemini-2.5-flash-lite (高级节点)"
  },
  "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": {
    baseUrl: "https://integrate.api.nvidia.com/v1",
    model: "qwen/qwen3.5-397b-a17b",
    name: "qwen/qwen3.5-397b-a17b"
  },

  // --- 正式/普通密钥（低端模型/便宜接口） ---
  "sk-basic-user-123": {
    baseUrl: "https://apis.iflow.cn/v1",  // 便宜的第三方兼容接口
    model: "qwen-plus",                   // 低配模型
    name: "Qwen Plus (标准节点)"
  }
};

/**
 * 默认兜底配置 (当用户输入的 Key 不在路由表中时)
 * 这样你可以分发很多普通的随机 Key，都走到这个便宜的默认接口
 */
const DEFAULT_CONFIG = {
  baseUrl: "https://apis.iflow.cn/v1",
  model: "deepseek-chat", 
  name: "DeepSeek (通用节点)"
};

/**
 * 解析 API 配置
 * @param {string} apiKey - 前端填写的密钥
 * @returns {Object} { baseUrl, model, name, apiKey }
 */
export const getApiConfig = (apiKey) => {
  const cleanKey = (apiKey || "").trim();
  
  // 1. 如果没有填写密钥，直接返回默认（需确保默认接口不需要验证，或者你前端要做拦截）
  if (!cleanKey) return { ...DEFAULT_CONFIG, apiKey: cleanKey };

  // 2. 匹配专属路由表
  const matchedConfig = KEY_ROUTER[cleanKey];
  if (matchedConfig) {
    return { ...matchedConfig, apiKey: cleanKey };
  }

  // 3. 没匹配上，说明是普通生成的散客 Key，走默认低端接口，但带上他的 Key
  return { ...DEFAULT_CONFIG, apiKey: cleanKey };
};

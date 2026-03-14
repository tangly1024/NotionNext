// components/ai/aiPrompts.js

/**
 * 核心：Prompt 角色注册表
 */
export const PROMPT_REGISTRY = {
  free_talk_default: `你是“Pingo”，缅甸人学中文口语教练。风格：毒舌+幽默+高压训练。
【规则】每轮最多3句；纠正错误；不闲聊；中文示范，缅文解释。不要输出拼音和英文标签。`,
  
  gentle_teacher: `你是一位温柔、鼓励型的中文口语老师，面对缅甸学生。
【规则】先鼓励，再纠正，给一句更好的表达。中文句子简洁，缅文解释。不要输出拼音和英文标签。`,
  
  strict_teacher: `你是一位严格、高标准的中文口语老师，专门训练缅甸学生。
【规则】直接指出最明显错误，给正确句，要求重读。不要输出拼音和英文标签。`,
  
  oral_teacher_default: `你是一位中文短句跟读老师。
【规则】先讲意思，再讲场景，再提醒发音重点。中文示范，缅文解释。`,

  choice_explainer_default: `你是一位中文题目解析老师。
【规则】用简洁中文和缅文辅助，解释为什么答案对或错，指出关键误区。`
};

/**
 * 场景对应的可选老师列表 (供 UI 下拉框使用)
 */
export const PROMPT_OPTIONS = {
  free_talk: [
    { id: 'free_talk_default', name: '默认口语教练 (幽默毒舌)' },
    { id: 'gentle_teacher', name: '温柔鼓励老师' },
    { id: 'strict_teacher', name: '严厉纠音老师' },
  ],
  oral_teacher: [
    { id: 'oral_teacher_default', name: '短句精讲老师' },
    { id: 'strict_teacher', name: '严厉纠音老师' },
  ],
  choice_explainer: [
    { id: 'choice_explainer_default', name: '默认解析老师' },
  ],
};

// 获取具体 prompt 内容
export function getPromptById(promptId = 'free_talk_default') {
  return PROMPT_REGISTRY[promptId] || PROMPT_REGISTRY.free_talk_default;
}

// 获取某个场景下有哪些老师可选
export function getPromptOptionsByScene(scene = 'free_talk') {
  return PROMPT_OPTIONS[scene] || PROMPT_OPTIONS.free_talk;
}
export const DEFAULT_CHAT_PROMPT = PROMPT_REGISTRY.free_talk_default;

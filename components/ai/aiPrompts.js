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
【规则】用简洁中文和缅文辅助，解释为什么答案对或错，指出关键误区。`,

  // 新增：互动解析老师专属提示词
  interactive_tutor_default: `你是一位互动题解析老师。请用简洁中文和缅文辅助解释并引导学生。
【规则】
1. 不要输出Markdown格式（如**、#等）。
2. 核心考点用中文示范，原理和解释细节用缅文。
3. 态度要循循善诱，像个耐心的老师。引导学生跟读或提问。`
};

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

export function getPromptById(promptId = 'free_talk_default') {
  return PROMPT_REGISTRY[promptId] || PROMPT_REGISTRY.free_talk_default;
}

export function getPromptOptionsByScene(scene = 'free_talk') {
  return PROMPT_OPTIONS[scene] || PROMPT_OPTIONS.free_talk;
}

export const DEFAULT_CHAT_PROMPT = PROMPT_REGISTRY.free_talk_default;

// 新增：构建互动题初始解析请求格式
export function buildInteractiveBootstrapPrompt(payload) {
  if (!payload) return '';

  const {
    questionText = '',
    options = [],
    selectedIds = [],
    correctAnswers = [],
    isRight = false
  } = payload;

  const selectedTexts = options
    .filter((opt) => selectedIds.includes(String(opt.id)))
    .map((opt) => opt.text);

  const correctTexts = options
    .filter((opt) => correctAnswers.includes(String(opt.id)))
    .map((opt) => opt.text);

  return `
这是当前题目，请先主动给我讲解这道题：

题目：${questionText || '无'}
选项：${options.map((o) => `${o.id}. ${o.text}`).join('；')}
学生选择：${selectedTexts.length ? selectedTexts.join('、') : '未选择'}
正确答案：${correctTexts.length ? correctTexts.join('、') : '未知'}
结果：${isRight ? '学生答对了' : '学生答错了'}

请先完成三件事：
1. 解释这题考什么
2. 说明为什么正确答案是这个
3. 如果学生答错了，先站在学生角度思考为什么选择这个答案，指出错误选项的关键误区

讲完后，等待学生继续追问或跟读。`.trim();
}

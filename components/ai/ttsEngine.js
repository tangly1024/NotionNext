// components/ai/aiTextUtils.js
export const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const mergeTranscript = (prev, next) => {
  const a = String(prev || '').trim();
  const b = String(next || '').trim();
  if (!a) return b;
  if (!b) return a;
  const maxOverlap = Math.min(a.length, b.length);
  for (let len = maxOverlap; len >= 2; len--) {
    if (a.slice(-len) === b.slice(0, len)) return a + b.slice(len);
  }
  if (b.startsWith(a)) return b;
  if (a.endsWith(b)) return a;
  return a + ' ' + b; 
};

const LABEL_PREFIX_RE = /^\s*(情绪|反馈|纠错|目标句|缅文释义|Target Sentence|Meaning(?:\(MY\))?|Correction|Emotion|Feedback)\s*[:：]\s*/i;
const EN_TEMPLATE_WORD_RE = /\b(Target Sentence|Meaning(?:\(MY\))?|Romanization|Pinyin|Correction|Emotion|Feedback|Hint)\b/gi;
const EN_ONLY_LINE_RE = /^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFFüÜvV\s'’.,;:!?-]+$/;

export const shouldHideLine = (line) => {
  const t = line.trim();
  if (!t) return true;
  if (/^[\s*#`_~\-\[\](){}<>|\\.,!?;:]+$/.test(t)) return true;
  if (/(拼音|罗马音|romanization|pinyin)/i.test(t)) return true;
  const hasZhOrMy = /[\u4e00-\u9fff\u1000-\u109F]/.test(t);
  const hasLatin = /[a-zA-Z]/.test(t);
  if (hasLatin && !hasZhOrMy) return true;
  if (!hasZhOrMy && EN_ONLY_LINE_RE.test(t)) return true;
  return false;
};

export const normalizeAssistantText = (text = '') =>
  text.replace(/\r/g, '').replace(/\*\*/g, '').replace(/[`*_#~]/g, '').replace(/\[[^\]]*?\]/g, '')
    .split('\n').map((line) => line.replace(LABEL_PREFIX_RE, '').replace(EN_TEMPLATE_WORD_RE, '').replace(/^\s*[-•]\s*/, '').trim())
    .filter((line) => !shouldHideLine(line)).join('\n').replace(/\n{3,}/g, '\n\n').trim();

// 核心优化：不再粗暴地替换逗号、句号，保留给TTS引擎自己控制原生停顿的呼吸节奏。
export const sanitizeForTTS = (text = '') =>
  normalizeAssistantText(text)
    .replace(/\([^)]*[a-zA-ZüÜvV][^)]*\)/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const splitMixedLanguage = (text) => {
  const segments = [];
  let currentLang = null; let currentBuffer = '';
  for (const char of text) {
    let type = 'neutral';
    if (/[\u4e00-\u9fa5]/.test(char)) type = 'zh';
    else if (/[\u1000-\u109F]/.test(char)) type = 'my';
    else if (/[a-zA-Z]/.test(char)) type = 'en';

    // 如果是中立字符(空格/标点)，则附加给上一次的语言避免被强制切碎
    if (type !== 'neutral') {
      if (currentLang !== type && currentLang !== null) {
        segments.push({ text: currentBuffer, lang: currentLang });
        currentBuffer = char; currentLang = type;
      } else { currentLang = type; currentBuffer += char; }
    } else { currentBuffer += char; }
  }
  if (currentBuffer.trim()) segments.push({ text: currentBuffer, lang: currentLang || 'zh' });
  return segments;
};

// 核心优化：加入逗号和分号，缩短送进TTS的延迟，让音频更流畅连接。
export const splitSpeakable = (buf) => {
  const out = []; let last = 0;
  for (let i = 0; i < buf.length; i++) {
    if (/[。！？.!?\n，,；;]/.test(buf[i])) {
      const s = buf.slice(last, i + 1).trim();
      if (s) out.push(s);
      last = i + 1;
    }
  }
  return { sentences: out, rest: buf.slice(last) };
};

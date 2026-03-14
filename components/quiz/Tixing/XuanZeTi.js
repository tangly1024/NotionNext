import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRobot,
  FaCog,
  FaRedo
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import InteractiveAIExplanationPanel from '../../ai/InteractiveAIExplanationPanel';

// =================================================================================
// 1. IndexedDB 缓存引擎
// =================================================================================
const idb = {
  db: null,
  async init() {
    if (typeof window === 'undefined' || this.db) return;
    return new Promise((resolve) => {
      const request = indexedDB.open('LessonCacheDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('tts_audio')) {
          db.createObjectStore('tts_audio');
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };
      request.onerror = () => resolve();
    });
  },
  async get(key) {
    await this.init();
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db.transaction('tts_audio', 'readonly');
      const req = tx.objectStore('tts_audio').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },
  async set(key, blob) {
    await this.init();
    if (!this.db) return;
    try {
      const tx = this.db.transaction('tts_audio', 'readwrite');
      tx.objectStore('tts_audio').put(blob, key);
    } catch (_) {}
  }
};

// =================================================================================
// 2. 音效与通用工具
// =================================================================================
function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function playBeep(type = 'tap') {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    let frequency = 520;
    let duration = 0.06;
    let volume = 0.03;

    if (type === 'correct') {
      frequency = 760;
      duration = 0.1;
      volume = 0.045;
    } else if (type === 'wrong') {
      frequency = 220;
      duration = 0.12;
      volume = 0.05;
    }

    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = volume;

    osc.start();
    osc.stop(ctx.currentTime + duration);

    osc.onended = () => {
      try {
        ctx.close();
      } catch (_) {}
    };
  } catch (_) {}
}

const PREFS_STORAGE_KEY = 'quiz_choice_prefs_v4';
const AI_STORAGE_KEY = 'interactive_ai_settings_v4';

const RATE_MAP = {
  slow: -30,
  normal: 0,
  fast: 20
};

const ZH_VOICE_OPTIONS = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓 (女)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰 (男)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓标准' },
  { id: 'zh-CN-YunxiNeural', name: '云希' },
  { id: 'zh-CN-YunjianNeural', name: '云健' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊' }
];

const MY_VOICE_OPTIONS = [
  { id: 'my-MM-ThihaNeural', name: 'Thiha' },
  { id: 'my-MM-NilarNeural', name: 'Nilar' }
];

const DEFAULT_PREFS = {
  showQuestionPinyin: true,
  showOptionPinyin: true,
  autoPlay: true,
  rateMode: 'normal'
};

const DEFAULT_AI_SETTINGS = {
  apiUrl: '',
  apiKey: '',
  model: 'mistral-large-2512',
  temperature: 0.2,
  systemPrompt:
    '你是一位互动题解析老师。请根据题目、选项、学生答案和正确答案，用简洁中文解释为什么对或错。不要太长，不要输出 Markdown。',
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  myVoice: 'my-MM-ThihaNeural',
  ttsSpeed: -10,
  ttsPitch: 0,
  soundFx: true,
  vibration: true
};

function getSavedPrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function getSavedAISettings() {
  if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS;
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) } : DEFAULT_AI_SETTINGS;
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

// =================================================================================
// 3. TTS 文本工具
// =================================================================================
const TTS_VOICES = {
  zh: 'zh-CN-XiaoxiaoMultilingualNeural',
  my: 'my-MM-ThihaNeural',
  en: 'en-US-JennyNeural'
};

const isChineseChar = (ch = '') => /[\u4e00-\u9fff]/.test(ch);
const isMyanmarChar = (ch = '') => /[\u1000-\u109F]/.test(ch);
const isLatinOrDigit = (ch = '') => /[a-zA-Z0-9]/.test(ch);
const isWhitespace = (ch = '') => /\s/.test(ch);
const containsChinese = (text = '') => /[\u4e00-\u9fff]/.test(text);

const isPunctuationOrSymbol = (ch = '') => {
  return !isChineseChar(ch) && !isMyanmarChar(ch) && !isLatinOrDigit(ch) && !isWhitespace(ch);
};

const detectWholeTextType = (text = '') => {
  const hasZh = /[\u4e00-\u9fff]/.test(text);
  const hasMy = /[\u1000-\u109F]/.test(text);
  const hasLatin = /[a-zA-Z0-9]/.test(text);
  const count = [hasZh, hasMy, hasLatin].filter(Boolean).length;

  if (count <= 1) {
    if (hasZh) return 'zh';
    if (hasMy) return 'my';
    if (hasLatin) return 'en';
  }
  return 'mixed';
};

function splitMixedText(text = '') {
  const wholeType = detectWholeTextType(text);
  if (wholeType !== 'mixed') {
    return [{ text: text.trim(), lang: wholeType }];
  }

  const chars = Array.from(text);
  const segments = [];
  let currentText = '';
  let currentLang = null;

  const pushCurrent = () => {
    const t = currentText.trim();
    if (t) segments.push({ text: t, lang: currentLang || 'zh' });
    currentText = '';
    currentLang = null;
  };

  for (const ch of chars) {
    let lang = null;

    if (isChineseChar(ch)) lang = 'zh';
    else if (isMyanmarChar(ch)) lang = 'my';
    else if (isLatinOrDigit(ch)) lang = 'en';
    else if (isWhitespace(ch)) {
      currentText += ch;
      continue;
    } else if (isPunctuationOrSymbol(ch)) {
      currentText += ch;
      continue;
    }

    if (!currentLang) {
      currentLang = lang;
      currentText += ch;
      continue;
    }

    if (lang === currentLang) {
      currentText += ch;
    } else {
      pushCurrent();
      currentLang = lang;
      currentText = ch;
    }
  }

  pushCurrent();

  if (!segments.length && text.trim()) {
    return [{ text: text.trim(), lang: 'zh' }];
  }

  return segments;
}

async function getTTSBlob(text, voice, rate = 0, apiUrl = 'https://t.leftsite.cn/tts') {
  const cacheKey = `${apiUrl}-${voice}-${rate}-${text}`;
  let blob = await idb.get(cacheKey);

  if (!blob) {
    const res = await fetch(`${apiUrl}?t=${encodeURIComponent(text)}&v=${voice}&r=${rate}`);
    if (!res.ok) throw new Error('TTS Failed');
    blob = await res.blob();
    await idb.set(cacheKey, blob);
  }

  return blob;
}

// =================================================================================
// 4. TTS 播放引擎
// =================================================================================
const audioController = {
  currentAudio: null,
  latestRequestId: 0,
  activeUrls: [],

  stop() {
    this.latestRequestId++;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio = null;
    }

    this.activeUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    });
    this.activeUrls = [];
  },

  async playMixed(text, { rate = 0, aiSettings = null } = {}, onStart, onEnd) {
    this.stop();

    const raw = String(text || '').trim();
    if (!raw) {
      onEnd?.();
      return;
    }

    const reqId = this.latestRequestId;
    onStart?.();

    try {
      const segments = splitMixedText(raw);
      const audios = [];

      for (const seg of segments) {
        if (reqId !== this.latestRequestId) return;

        const segText = String(seg.text || '').trim();
        if (!segText) continue;

        const voice =
          seg.lang === 'my'
            ? (aiSettings?.myVoice || TTS_VOICES.my)
            : seg.lang === 'en'
            ? TTS_VOICES.en
            : (aiSettings?.zhVoice || TTS_VOICES.zh);

        const blob = await getTTSBlob(
          segText,
          voice,
          rate,
          aiSettings?.ttsApiUrl || 'https://t.leftsite.cn/tts'
        );

        if (reqId !== this.latestRequestId) return;

        const url = URL.createObjectURL(blob);
        this.activeUrls.push(url);
        audios.push(new Audio(url));
      }

      if (reqId !== this.latestRequestId) return;

      if (!audios.length) {
        onEnd?.();
        return;
      }

      const playNext = (index) => {
        if (reqId !== this.latestRequestId) return;

        if (index >= audios.length) {
          if (reqId === this.latestRequestId) onEnd?.();
          return;
        }

        const audio = audios[index];
        this.currentAudio = audio;
        audio.onended = () => playNext(index + 1);
        audio.onerror = () => playNext(index + 1);
        audio.play().catch(() => playNext(index + 1));
      };

      playNext(0);
    } catch (e) {
      console.warn('[TTS Error]:', e);
      if (reqId === this.latestRequestId) onEnd?.();
    }
  }
};

// =================================================================================
// 5. 样式
// =================================================================================
const cssStyles = `
.xzt-container { font-family:"Padauk","Noto Sans SC",sans-serif; display:flex; flex-direction:column; background:transparent; width:100%; height:100%; position:relative; }
.xzt-header { flex-shrink:0; padding:8px 16px 2px; display:flex; justify-content:center; }
.top-hint-row { width:100%; display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:4px; }
.top-left-text { font-size:15px; font-weight:900; color:#334155; line-height:1.2; }
.top-actions { display:flex; align-items:center; gap:10px; }
.settings-btn { display:flex; align-items:center; justify-content:center; color:#64748b; cursor:pointer; font-size:18px; padding:2px; background:none; border:none; }

.scene-wrapper { width:100%; display:flex; align-items:flex-start; gap:12px; margin-top:-4px; }
.teacher-img { height:138px; object-fit:contain; flex-shrink:0; margin-top:6px; }
.question-zone { flex:1; display:flex; flex-direction:column; gap:14px; }

.bubble-container {
  flex:1;
  background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%);
  border-radius:30px;
  padding:20px 16px;
  border:3px solid #bfdbfe;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  box-shadow:0 12px 28px rgba(37,99,235,0.10), 0 3px 0 rgba(59,130,246,0.08);
  min-height:96px;
}
.bubble-tail {
  position:absolute;
  bottom:24px;
  left:-12px;
  width:0;
  height:0;
  border-top:10px solid transparent;
  border-bottom:10px solid transparent;
  border-right:12px solid #bfdbfe;
}
.bubble-tail::after {
  content:'';
  position:absolute;
  top:-8px;
  left:3px;
  border-top:8px solid transparent;
  border-bottom:8px solid transparent;
  border-right:10px solid #ffffff;
}

.zh-seg { display:inline-flex; flex-direction:column; align-items:center; margin:0 1px; }
.zh-py { font-size:.7rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:3px; }
.zh-char { font-size:1.52rem; font-weight:900; color:#1e293b; line-height:1.16; }
.my-seg { font-size:1.08rem; font-weight:700; color:#334155; white-space:pre-wrap; }
.bubble-play-btn {
  flex-shrink:0;
  width:52px;
  height:52px;
  border-radius:9999px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:inset 0 -2px 0 rgba(0,0,0,0.06), 0 6px 12px rgba(37,99,235,0.14);
}

.question-image {
  width:100%;
  max-width:310px;
  align-self:center;
  border-radius:22px;
  border:3px solid #f1f5f9;
  background:#fff;
  box-shadow:0 8px 20px rgba(15,23,42,0.06);
  object-fit:cover;
}

.xzt-scroll-area { flex:1; overflow-y:auto; padding:10px 16px 132px; display:flex; flex-direction:column; align-items:center; -webkit-overflow-scrolling:touch; }
.options-grid { width:100%; display:grid; gap:12px; grid-template-columns:1fr; }
.options-grid.has-images { grid-template-columns:1fr 1fr; }

.option-card { background:#fff; border-radius:20px; padding:14px; border:2px solid #e5e7eb; border-bottom-width:5px; cursor:pointer; transition:all .12s ease; display:flex; align-items:center; justify-content:center; min-height:68px; position:relative; user-select:none; -webkit-tap-highlight-color:transparent; box-shadow:0 2px 0 rgba(0,0,0,0.02); }
.option-card:active { transform:translateY(2px); border-bottom-width:3px; }
.option-card.selected { border-color:#84cc16; background:#f7fee7; color:#4d7c0f; }
.option-card.playing { border-color:#60a5fa; background:#eff6ff; color:#1d4ed8; }
.option-card.correct { border-color:#84cc16; background:#dcfce7; color:#365314; }
.option-card.wrong { border-color:#fca5a5; background:#fff5f5; color:#c2410c; }
.option-card.locked { cursor:default; transform:none; }
.option-card.has-image-layout { flex-direction:column; align-items:stretch; justify-content:flex-start; padding:12px; }
.option-text-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; }
.option-py { font-size:.68rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:4px; text-align:center; }
.option-text { font-size:1.15rem; font-weight:700; text-align:center; }

.submit-bar {
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  padding:16px 16px calc(16px + env(safe-area-inset-bottom));
  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%);
  display:flex;
  justify-content:center;
}
.submit-btn {
  width:100%;
  max-width:400px;
  padding:16px;
  border-radius:18px;
  font-size:1.15rem;
  font-weight:900;
  background:#58cc02;
  color:#fff;
  border:none;
  border-bottom:4px solid #46a302;
  cursor:pointer;
  transition:all .1s;
  box-shadow:0 4px 12px rgba(88,204,2,0.25);
}
.submit-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:0 2px 0 #46a302; }
.submit-btn:disabled { background:#e5e5e5; color:#9ca3af; border-bottom-color:#d1d5db; box-shadow:none; cursor:not-allowed; }

.result-sheet {
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  padding:20px 16px calc(20px + env(safe-area-inset-bottom));
  border-top-left-radius:24px;
  border-top-right-radius:24px;
  display:flex;
  flex-direction:column;
  gap:12px;
  transform:translateY(100%);
  transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:0 -10px 30px rgba(0,0,0,0.08);
  z-index:100;
}
.result-sheet.show { transform:translateY(0); }
.result-sheet.correct { background:#d7ffb8; border-top:3px solid #a3e635; }
.result-sheet.wrong { background:#ffdfe0; border-top:3px solid #fca5a5; }

.sheet-header { display:flex; align-items:center; gap:8px; font-size:1.35rem; font-weight:900; }
.result-sheet.correct .sheet-header { color:#58cc02; }
.result-sheet.wrong .sheet-header { color:#ef4444; }
.sheet-sub { font-size:0.95rem; font-weight:700; color:#64748b; margin-bottom:8px; }

.ai-btn {
  background:#fff;
  padding:12px;
  border-radius:14px;
  font-weight:900;
  color:#8b5cf6;
  border:2px solid #ddd6fe;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  cursor:pointer;
  box-shadow:0 4px 0 #ddd6fe;
  margin-bottom:8px;
}
.ai-btn:active { transform:translateY(4px); box-shadow:none; }

.next-btn {
  width:100%;
  padding:16px;
  border-radius:18px;
  font-size:1.15rem;
  font-weight:900;
  color:#fff;
  border:none;
  border-bottom:4px solid;
  cursor:pointer;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
  transition:all .1s;
}
.btn-correct { background:#58cc02; border-bottom-color:#46a302; box-shadow:0 4px 12px rgba(88,204,2,0.25); }
.btn-wrong { background:#ef4444; border-bottom-color:#dc2626; box-shadow:0 4px 12px rgba(239,68,68,0.25); }
.next-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:none; }

.settings-pop {
  position:absolute;
  top:38px;
  right:0;
  z-index:120;
  width:300px;
  background:#fff;
  border:2px solid #e5e7eb;
  border-radius:20px;
  box-shadow:0 14px 30px rgba(15,23,42,0.12);
  padding:14px;
}
.settings-section-title {
  font-size:11px;
  font-weight:900;
  color:#94a3b8;
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-bottom:10px;
  margin-top:14px;
}
.setting-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 2px; }
.setting-label { font-size:13px; font-weight:900; color:#334155; }
.switch { width:42px; height:24px; border-radius:9999px; position:relative; transition:all .2s; cursor:pointer; }
.switch-dot { position:absolute; top:3px; width:16px; height:16px; border-radius:9999px; background:#fff; transition:all .2s; box-shadow:0 1px 4px rgba(0,0,0,.15); }
.speed-group { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:6px; }
.speed-btn {
  border:2px solid #e5e7eb;
  background:#fff;
  color:#64748b;
  border-radius:12px;
  font-size:12px;
  font-weight:900;
  padding:10px 0;
  cursor:pointer;
}
.speed-btn.active { background:#ecfccb; border-color:#bef264; color:#3f6212; }

.select-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
.small-choice-btn {
  border:2px solid #e5e7eb;
  background:#fff;
  color:#475569;
  border-radius:12px;
  font-size:11px;
  font-weight:900;
  padding:10px 8px;
  cursor:pointer;
  text-align:center;
}
.small-choice-btn.active {
  background:#f5f3ff;
  border-color:#c4b5fd;
  color:#6d28d9;
}
.text-input {
  width:100%;
  border:2px solid #e5e7eb;
  border-radius:12px;
  padding:10px 12px;
  font-size:12px;
  color:#334155;
  outline:none;
  margin-top:8px;
}
.textarea-input {
  width:100%;
  border:2px solid #e5e7eb;
  border-radius:12px;
  padding:10px 12px;
  font-size:12px;
  color:#334155;
  outline:none;
  resize:vertical;
  margin-top:8px;
}

.bounce-in { animation: xzt-bounce .28s ease-out; }
@keyframes xzt-bounce {
  0% { transform: scale(0.97); }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
`;

function getPinyinArraySafe(text = '') {
  const cleaned = String(text).replace(/[^\u4e00-\u9fff]/g, '');
  if (!cleaned) return [];
  try {
    return pinyin(cleaned, { type: 'array', toneType: 'symbol' });
  } catch (_) {
    return [];
  }
}

function renderTextWithOptionalPinyin(text, showPinyin, textClass = 'zh-char', pyClass = 'zh-py') {
  if (!text) return null;

  const parts = String(text).match(/([\u4e00-\u9fff]+|[^\u4e00-\u9fff]+)/g) || [];

  return parts.map((part, i) => {
    if (/[\u4e00-\u9fff]/.test(part)) {
      const py = getPinyinArraySafe(part);
      const chars = part.split('');
      return chars.map((char, j) => (
        <div key={`${i}-${j}`} className="zh-seg">
          {showPinyin ? <span className={pyClass}>{py[j] || ''}</span> : null}
          <span className={textClass}>{char}</span>
        </div>
      ));
    }

    return (
      <span key={i} className="my-seg">
        {part}
      </span>
    );
  });
}

function SettingsPanel({ prefs, setPrefs, aiSettings, updateAISettings, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[110]" onClick={onClose} />
      <div className="settings-pop">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-700">设置</span>
          <button onClick={onClose}>
            <FaTimes className="text-slate-400" />
          </button>
        </div>

        <div className="settings-section-title" style={{ marginTop: 0 }}>学习设置</div>

        <div className="setting-row">
          <span className="setting-label">题干拼音</span>
          <div
            className="switch"
            onClick={() => setPrefs((s) => ({ ...s, showQuestionPinyin: !s.showQuestionPinyin }))}
            style={{ background: prefs.showQuestionPinyin ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.showQuestionPinyin ? '22px' : '4px' }} />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">选项拼音</span>
          <div
            className="switch"
            onClick={() => setPrefs((s) => ({ ...s, showOptionPinyin: !s.showOptionPinyin }))}
            style={{ background: prefs.showOptionPinyin ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.showOptionPinyin ? '22px' : '4px' }} />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">自动朗读</span>
          <div
            className="switch"
            onClick={() => setPrefs((s) => ({ ...s, autoPlay: !s.autoPlay }))}
            style={{ background: prefs.autoPlay ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.autoPlay ? '22px' : '4px' }} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="setting-label" style={{ marginBottom: 8 }}>题目语速</div>
          <div className="speed-group">
            {[
              { key: 'slow', label: '慢' },
              { key: 'normal', label: '正常' },
              { key: 'fast', label: '快' }
            ].map((item) => (
              <button
                key={item.key}
                className={`speed-btn ${prefs.rateMode === item.key ? 'active' : ''}`}
                onClick={() => setPrefs((s) => ({ ...s, rateMode: item.key }))}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section-title">AI 设置</div>

        <input
          className="text-input"
          placeholder="API URL"
          value={aiSettings.apiUrl}
          onChange={(e) => updateAISettings({ apiUrl: e.target.value })}
        />

        <input
          className="text-input"
          placeholder="API Key"
          type="password"
          value={aiSettings.apiKey}
          onChange={(e) => updateAISettings({ apiKey: e.target.value })}
        />

        <input
          className="text-input"
          placeholder="模型"
          value={aiSettings.model}
          onChange={(e) => updateAISettings({ model: e.target.value })}
        />

        <div style={{ marginTop: 10 }}>
          <div className="setting-label" style={{ marginBottom: 8 }}>AI 温度</div>
          <input
            type="range"
            min="0"
            max="1.2"
            step="0.05"
            value={aiSettings.temperature}
            onChange={(e) => updateAISettings({ temperature: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <textarea
          className="textarea-input"
          rows={4}
          placeholder="系统提示词"
          value={aiSettings.systemPrompt}
          onChange={(e) => updateAISettings({ systemPrompt: e.target.value })}
        />

        <div className="settings-section-title">AI 发音人</div>

        <div className="setting-label" style={{ marginBottom: 6 }}>中文声音</div>
        <div className="select-grid-2">
          {ZH_VOICE_OPTIONS.map((item) => (
            <button
              key={item.id}
              className={`small-choice-btn ${aiSettings.zhVoice === item.id ? 'active' : ''}`}
              onClick={() => updateAISettings({ zhVoice: item.id })}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="setting-label" style={{ marginTop: 12, marginBottom: 6 }}>缅语声音</div>
        <div className="select-grid-2">
          {MY_VOICE_OPTIONS.map((item) => (
            <button
              key={item.id}
              className={`small-choice-btn ${aiSettings.myVoice === item.id ? 'active' : ''}`}
              onClick={() => updateAISettings({ myVoice: item.id })}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="setting-label" style={{ marginBottom: 8 }}>AI 朗读语速</div>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={aiSettings.ttsSpeed}
            onChange={(e) => updateAISettings({ ttsSpeed: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div className="setting-row" style={{ marginTop: 4 }}>
          <span className="setting-label">震动反馈</span>
          <div
            className="switch"
            onClick={() => updateAISettings({ vibration: !aiSettings.vibration })}
            style={{ background: aiSettings.vibration ? '#7c3aed' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: aiSettings.vibration ? '22px' : '4px' }} />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">音效反馈</span>
          <div
            className="switch"
            onClick={() => updateAISettings({ soundFx: !aiSettings.soundFx })}
            style={{ background: aiSettings.soundFx ? '#7c3aed' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: aiSettings.soundFx ? '22px' : '4px' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// =================================================================================
// 6. 主组件
// =================================================================================
export default function XuanZeTi({ data: rawData, onCorrect, onWrong, onNext }) {
  const data = rawData?.content || rawData || {};
  const question = data.question || {};
  const questionText = typeof question === 'string' ? question : question.text || '';
  const questionImg = data.imageUrl || '';
  const options = data.options || [];

  const correctAnswers = useMemo(() => {
    const raw = data.correctAnswer || [];
    return (Array.isArray(raw) ? raw : [raw]).map(String);
  }, [data.correctAnswer]);

  const hasOptionImages = useMemo(
    () => options.some((opt) => opt.img || opt.imageUrl),
    [options]
  );

  const shuffledOptions = useMemo(() => {
    const opts = [...options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [data?.id, options]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [speakingOptionId, setSpeakingOptionId] = useState(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cardPopId, setCardPopId] = useState(null);
  const [questionImgVisible, setQuestionImgVisible] = useState(Boolean(questionImg));
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  const [prefs, setPrefs] = useState(() => getSavedPrefs());
  const [aiSettings, setAISettings] = useState(() => getSavedAISettings());

  const mountedRef = useRef(true);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    }
  }, [prefs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiSettings));
    }
  }, [aiSettings]);

  useEffect(() => {
    setQuestionImgVisible(Boolean(questionImg));
  }, [questionImg]);

  const currentRate = RATE_MAP[prefs.rateMode] ?? 0;

  useEffect(() => {
    clearTimers();
    audioController.stop();

    setSelectedIds([]);
    setIsSubmitted(false);
    setIsRight(false);
    setShowResultSheet(false);
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);
    setShowSettings(false);
    setCardPopId(null);
    setShowAIExplanation(false);

    if (questionText && prefs.autoPlay) {
      addTimer(() => {
        audioController.playMixed(
          questionText,
          { rate: currentRate, aiSettings },
          () => mountedRef.current && setIsQuestionPlaying(true),
          () => mountedRef.current && setIsQuestionPlaying(false)
        );
      }, 260);
    }

    return () => {
      clearTimers();
      audioController.stop();
    };
  }, [data?.id, questionText, prefs.autoPlay, currentRate]);

  const updateAISettings = (patch) => {
    setAISettings((prev) => ({ ...prev, ...patch }));
  };

  const feedbackTap = () => {
    if (aiSettings.vibration) vibrate(15);
    if (aiSettings.soundFx) playBeep('tap');
  };

  const feedbackCorrect = () => {
    if (aiSettings.vibration) vibrate([30, 40, 30]);
    if (aiSettings.soundFx) playBeep('correct');
  };

  const feedbackWrong = () => {
    if (aiSettings.vibration) vibrate([40, 40, 40]);
    if (aiSettings.soundFx) playBeep('wrong');
  };

  const playQuestion = () => {
    if (!questionText) return;
    setSpeakingOptionId(null);
    audioController.playMixed(
      questionText,
      { rate: currentRate, aiSettings },
      () => mountedRef.current && setIsQuestionPlaying(true),
      () => mountedRef.current && setIsQuestionPlaying(false)
    );
  };

  const toggleOption = (id) => {
    if (isSubmitted) return;

    feedbackTap();

    const sid = String(id);

    if (correctAnswers.length === 1) {
      setSelectedIds([sid]);
    } else {
      setSelectedIds((prev) =>
        prev.includes(sid) ? prev.filter((i) => i !== sid) : [...prev, sid]
      );
    }

    setCardPopId(sid);
    setTimeout(() => {
      if (mountedRef.current) {
        setCardPopId((prev) => (prev === sid ? null : prev));
      }
    }, 180);

    const opt = options.find((o) => String(o.id) === sid);
    if (opt?.text) {
      setIsQuestionPlaying(false);
      audioController.playMixed(
        opt.text,
        { rate: currentRate, aiSettings },
        () => mountedRef.current && setSpeakingOptionId(sid),
        () => mountedRef.current && setSpeakingOptionId(null)
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedIds.length || isSubmitted) return;

    const correct =
      selectedIds.length === correctAnswers.length &&
      selectedIds.every((id) => correctAnswers.includes(id));

    setIsRight(correct);
    setIsSubmitted(true);
    audioController.stop();
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);

    if (correct) {
      feedbackCorrect();
      onCorrect?.();
    } else {
      feedbackWrong();
      onWrong?.();
    }

    setShowResultSheet(true);
  };

  const handleAI = () => {
    if (!aiSettings.apiUrl || !aiSettings.apiKey) {
      setShowSettings(true);
      alert('请先在设置中配置大模型 API Key');
      return;
    }
    setShowAIExplanation(true);
  };

  return (
    <div className="xzt-container">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div className="xzt-header">
        <div className="w-full relative">
          <div className="top-hint-row">
            <div className="top-left-text">请选择正确答案</div>

            <div className="top-actions">
              <button className="settings-btn" onClick={() => setShowSettings((v) => !v)}>
                <FaCog size={18} />
              </button>
            </div>
          </div>

          {showSettings && (
            <SettingsPanel
              prefs={prefs}
              setPrefs={setPrefs}
              aiSettings={aiSettings}
              updateAISettings={updateAISettings}
              onClose={() => setShowSettings(false)}
            />
          )}

          <div className="scene-wrapper">
            <img
              src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/1765952194374.png"
              className="teacher-img"
              alt="Teacher"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <div className="question-zone">
              <div className="bubble-container">
                <div className="bubble-tail" />

                <div className="flex-1 flex flex-wrap items-end gap-1">
                  {renderTextWithOptionalPinyin(
                    questionText,
                    prefs.showQuestionPinyin,
                    'zh-char',
                    'zh-py'
                  )}
                </div>

                {questionText && (
                  <div
                    className="bubble-play-btn"
                    style={{
                      background: isQuestionPlaying ? '#2563eb' : '#eff6ff',
                      color: isQuestionPlaying ? '#fff' : '#2563eb'
                    }}
                    onClick={playQuestion}
                  >
                    {isQuestionPlaying ? (
                      <FaSpinner className="animate-spin" size={20} />
                    ) : (
                      <FaVolumeUp size={20} />
                    )}
                  </div>
                )}
              </div>

              {questionImg && questionImgVisible ? (
                <img
                  src={questionImg}
                  alt="question"
                  className="question-image"
                  onError={() => setQuestionImgVisible(false)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="xzt-scroll-area">
        <div className={`options-grid ${hasOptionImages ? 'has-images' : ''}`}>
          {shuffledOptions.map((opt) => {
            const sid = String(opt.id);
            const isSel = selectedIds.includes(sid);
            const isCorrectAns = correctAnswers.includes(sid);

            let cls = 'option-card';
            if (opt.img || opt.imageUrl) cls += ' has-image-layout';
            if (cardPopId === sid) cls += ' bounce-in';

            if (isSubmitted) {
              cls += ' locked';
              if (isCorrectAns) cls += ' correct';
              else if (isSel) cls += ' wrong';
            } else {
              if (speakingOptionId === sid) cls += ' playing';
              else if (isSel) cls += ' selected';
            }

            const showPy = prefs.showOptionPinyin && containsChinese(opt.text);

            return (
              <div key={sid} className={cls} onClick={() => toggleOption(sid)}>
                {speakingOptionId === sid && (
                  <FaSpinner className="absolute top-3 right-3 text-blue-500 animate-spin" />
                )}

                {(opt.img || opt.imageUrl) && (
                  <img
                    src={opt.img || opt.imageUrl}
                    alt="opt"
                    className="h-24 w-full object-cover rounded-xl mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <div className="option-text-wrap">
                  {showPy ? (
                    <div className="option-py">
                      {pinyin(String(opt.text).replace(/[^\u4e00-\u9fff]/g, ''), {
                        toneType: 'symbol'
                      })}
                    </div>
                  ) : null}
                  <span className="option-text">{opt.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isSubmitted && (
        <div className="submit-bar">
          <button className="submit-btn" disabled={!selectedIds.length} onClick={handleSubmit}>
            检查答案
          </button>
        </div>
      )}

      <div className={`result-sheet ${showResultSheet ? 'show' : ''} ${isRight ? 'correct' : 'wrong'}`}>
        <div className="sheet-header">
          {isRight ? <FaCheck /> : <FaTimes />}
          <span>{isRight ? '答对了！' : '再试试看'}</span>
        </div>

        <div className="sheet-sub">
          {isRight ? '太棒了，继续前进。' : '你已经很接近正确答案了。'}
        </div>

        {!isRight && (
          <button className="ai-btn" onClick={handleAI}>
            <FaRobot /> AI 语音讲题老师
          </button>
        )}

        <button
          className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`}
          onClick={() => {
            audioController.stop();
            onNext?.();
          }}
        >
          继续 <FaArrowRight />
        </button>
      </div>

      <InteractiveAIExplanationPanel
        open={showAIExplanation}
        onClose={() => setShowAIExplanation(false)}
        settings={aiSettings}
        title="AI 讲题老师"
        initialPayload={{
          questionText,
          options: shuffledOptions,
          selectedIds,
          correctAnswers,
          isRight
        }}
      />
    </div>
  );
}

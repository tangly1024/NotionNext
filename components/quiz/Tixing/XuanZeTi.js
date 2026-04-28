import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRobot,
  FaCog,
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import {
  getSavedInteractivePrefs,
  getSavedInteractiveAISettings,
  saveInteractivePrefs,
  saveInteractiveAISettings,
  speedLabelToRate,
} from '../../interactiveQuiz/interactiveSettings';

const TTS_VOICES = {
  zh: 'zh-CN-XiaoxiaoMultilingualNeural',
  my: 'my-MM-ThihaNeural',
  en: 'en-US-JennyNeural',
};

const TEACHER_IMAGE_URL =
  'https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/1765952194374.png';

const cssStyles = `
.xzt-container {
  font-family:"Padauk","Noto Sans SC",sans-serif;
  display:flex;
  flex-direction:column;
  background:transparent;
  width:100%;
  height:100%;
  position:relative;
  overflow:hidden;
}
.xzt-container.settings-open .result-sheet,
.xzt-container.settings-open .submit-bar {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}
.xzt-header {
  flex-shrink:0;
  padding:8px 16px 2px;
  display:flex;
  justify-content:center;
}
.top-hint-row {
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:4px;
}
.top-left-text {
  font-size:15px;
  font-weight:900;
  color:#334155;
  line-height:1.2;
}
.top-actions {
  display:flex;
  align-items:center;
  gap:10px;
}
.settings-btn {
  display:flex;
  align-items:center;
  justify-content:center;
  color:#64748b;
  cursor:pointer;
  font-size:18px;
  padding:2px;
  background:none;
  border:none;
}

.scene-wrapper {
  width:100%;
  display:flex;
  align-items:flex-start;
  gap:12px;
  margin-top:-4px;
}
.teacher-img {
  height:126px;
  object-fit:contain;
  flex-shrink:0;
  margin-top:10px;
}
.question-zone {
  flex:1;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.bubble-container {
  flex:1;
  background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%);
  border-radius:18px;
  padding:14px 14px 14px 10px;
  border:2px solid #dbeafe;
  position:relative;
  display:flex;
  align-items:flex-start;
  gap:10px;
  box-shadow:0 8px 18px rgba(37,99,235,0.08), 0 2px 0 rgba(59,130,246,0.05);
  min-height:82px;
}

.bubble-tail {
  position:absolute;
  left:-10px;
  top:22px;
  width:12px;
  height:12px;
  background:#ffffff;
  border-left:2px solid #dbeafe;
  border-bottom:2px solid #dbeafe;
  transform:rotate(45deg);
}

.bubble-text {
  flex:1;
  min-width:0;
  display:flex;
  flex-wrap:wrap;
  align-items:flex-end;
  gap:2px 3px;
  color:#1e293b;
}

.zh-seg {
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  margin:0 1px;
}

.zh-py {
  font-size:0.66rem;
  color:#94a3b8;
  line-height:1;
  font-weight:700;
  margin-bottom:2px;
}

.zh-char {
  font-size:1.38rem;
  font-weight:900;
  color:#1e293b;
  line-height:1.18;
}

.bubble-text.is-long .zh-char {
  font-size:1.22rem;
}

.bubble-text.is-very-long .zh-char {
  font-size:1.06rem;
}

.bubble-text.is-long .zh-py {
  font-size:0.60rem;
}

.my-seg {
  font-size:0.98rem;
  font-weight:700;
  color:#334155;
  white-space:pre-wrap;
  line-height:1.85;
  word-break:break-word;
  overflow-wrap:anywhere;
}

.bubble-text.is-myanmar .my-seg {
  font-size:0.96rem;
  line-height:1.9;
}

.bubble-text.is-myanmar.is-long .my-seg {
  font-size:0.91rem;
  line-height:1.95;
}

.bubble-text.is-myanmar.is-very-long .my-seg {
  font-size:0.87rem;
  line-height:2;
}

.inline-seg {
  font-size:0.98rem;
  font-weight:700;
  color:#475569;
  white-space:pre-wrap;
  line-height:1.6;
}

.bubble-audio-btn {
  flex-shrink:0;
  width:28px;
  height:28px;
  margin-top:2px;
  border-radius:9999px;
  border:1.5px solid #dbeafe;
  background:#ffffff;
  color:#3b82f6;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 2px 6px rgba(59,130,246,0.08);
}

.bubble-audio-btn.playing {
  background:#eff6ff;
  color:#2563eb;
  border-color:#93c5fd;
}

.bubble-audio-btn:active {
  transform:scale(0.96);
}

.question-image {
  width:100%;
  max-width:310px;
  align-self:center;
  border-radius:16px;
  border:2px solid #f1f5f9;
  background:#fff;
  box-shadow:0 8px 20px rgba(15,23,42,0.06);
  object-fit:cover;
}

.xzt-scroll-area {
  flex:1;
  overflow-y:auto;
  padding:10px 16px 132px;
  display:flex;
  flex-direction:column;
  align-items:center;
  -webkit-overflow-scrolling:touch;
}
.options-grid {
  width:100%;
  display:grid;
  gap:12px;
  grid-template-columns:1fr;
}
.options-grid.has-images {
  grid-template-columns:1fr 1fr;
}

.option-card {
  background:#fff;
  border-radius:16px;
  padding:14px;
  border:2px solid #e5e7eb;
  border-bottom-width:5px;
  cursor:pointer;
  transition:all .12s ease;
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:68px;
  position:relative;
  user-select:none;
  -webkit-tap-highlight-color:transparent;
  box-shadow:0 2px 0 rgba(0,0,0,0.02);
}
.option-card:active {
  transform:translateY(2px);
  border-bottom-width:3px;
}
.option-card.selected {
  border-color:#84cc16;
  background:#f7fee7;
  color:#4d7c0f;
}
.option-card.playing {
  border-color:#60a5fa;
  background:#eff6ff;
  color:#1d4ed8;
}
.option-card.correct {
  border-color:#84cc16;
  background:#dcfce7;
  color:#365314;
}
.option-card.wrong {
  border-color:#fca5a5;
  background:#fff5f5;
  color:#c2410c;
}
.option-card.locked {
  cursor:default;
  transform:none;
}
.option-card.has-image-layout {
  flex-direction:column;
  align-items:stretch;
  justify-content:flex-start;
  padding:12px;
}
.option-text-wrap {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}
.option-py {
  font-size:.68rem;
  color:#94a3b8;
  line-height:1;
  font-weight:700;
  margin-bottom:4px;
  text-align:center;
}
.option-text {
  font-size:1.15rem;
  font-weight:700;
  text-align:center;
}

.submit-bar {
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  padding:16px 16px calc(16px + env(safe-area-inset-bottom));
  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%);
  display:flex;
  justify-content:center;
  z-index:30;
  transition:opacity 0.3s;
}
.submit-btn {
  width:100%;
  max-width:400px;
  padding:16px;
  border-radius:16px;
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
.submit-btn:active {
  transform:translateY(4px);
  border-bottom-width:1px;
  box-shadow:0 2px 0 #46a302;
}
.submit-btn:disabled {
  background:#e5e5e5;
  color:#9ca3af;
  border-bottom-color:#d1d5db;
  box-shadow:none;
  cursor:not-allowed;
}

.result-sheet {
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  padding:20px 16px calc(20px + env(safe-area-inset-bottom));
  border-top-left-radius:20px;
  border-top-right-radius:20px;
  display:flex;
  flex-direction:column;
  gap:12px;
  transform:translateY(100%);
  transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
  box-shadow:0 -10px 30px rgba(0,0,0,0.08);
  z-index:100;
}
.result-sheet.show {
  transform:translateY(0);
}
.result-sheet.correct {
  background:#d7ffb8;
  border-top:3px solid #a3e635;
}
.result-sheet.wrong {
  background:#ffdfe0;
  border-top:3px solid #fca5a5;
}

.sheet-header {
  display:flex;
  align-items:center;
  gap:8px;
  font-size:1.35rem;
  font-weight:900;
}
.result-sheet.correct .sheet-header {
  color:#58cc02;
}
.result-sheet.wrong .sheet-header {
  color:#ef4444;
}
.sheet-sub {
  font-size:0.95rem;
  font-weight:700;
  color:#64748b;
  margin-bottom:8px;
}

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
.ai-btn:active {
  transform:translateY(4px);
  box-shadow:none;
}

.next-btn {
  width:100%;
  padding:16px;
  border-radius:16px;
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
.btn-correct {
  background:#58cc02;
  border-bottom-color:#46a302;
  box-shadow:0 4px 12px rgba(88,204,2,0.25);
}
.btn-wrong {
  background:#ef4444;
  border-bottom-color:#dc2626;
  box-shadow:0 4px 12px rgba(239,68,68,0.25);
}
.next-btn:active {
  transform:translateY(4px);
  border-bottom-width:1px;
  box-shadow:none;
}

.modal-backdrop {
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.35);
  backdrop-filter:blur(4px);
}
.panel-modal {
  position:fixed;
  inset:0;
  z-index:2147483600;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  padding:16px;
}
.panel-card {
  width:100%;
  max-width:420px;
  max-height:min(82vh,760px);
  overflow-y:auto;
  background:#fff;
  border:2px solid #e5e7eb;
  border-radius:20px;
  box-shadow:0 20px 50px rgba(15,23,42,0.20);
  padding:16px;
}
.panel-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:8px;
}
.panel-title {
  font-size:16px;
  font-weight:900;
  color:#334155;
}
.panel-close-btn {
  width:34px;
  height:34px;
  border:none;
  background:#f1f5f9;
  color:#64748b;
  border-radius:9999px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
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
.setting-row {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:10px 2px;
}
.setting-label {
  font-size:13px;
  font-weight:900;
  color:#334155;
}
.switch {
  width:42px;
  height:24px;
  border-radius:9999px;
  position:relative;
  transition:all .2s;
  cursor:pointer;
}
.switch-dot {
  position:absolute;
  top:3px;
  width:16px;
  height:16px;
  border-radius:9999px;
  background:#fff;
  transition:all .2s;
  box-shadow:0 1px 4px rgba(0,0,0,.15);
}
.speed-group {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:6px;
}
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
.speed-btn.active {
  background:#ecfccb;
  border-color:#bef264;
  color:#3f6212;
}

.bounce-in {
  animation:xzt-bounce .28s ease-out;
}
@keyframes xzt-bounce {
  0% { transform:scale(0.97); }
  60% { transform:scale(1.02); }
  100% { transform:scale(1); }
}
`;

const indexedBlobCache = {
  db: null,
  initPromise: null,

  async init() {
    if (typeof window === 'undefined') return null;
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      const request = indexedDB.open('LessonCacheDB', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('tts_audio')) {
          db.createObjectStore('tts_audio');
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = () => resolve(null);
    });

    return this.initPromise;
  },

  async get(key) {
    const db = await this.init();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction('tts_audio', 'readonly');
      const req = tx.objectStore('tts_audio').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },

  async set(key, blob) {
    const db = await this.init();
    if (!db) return;

    try {
      const tx = db.transaction('tts_audio', 'readwrite');
      tx.objectStore('tts_audio').put(blob, key);
    } catch (_) {}
  },
};

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

const isChineseChar = (char = '') => /[\u4e00-\u9fff]/.test(char);
const isMyanmarChar = (char = '') => /[\u1000-\u109F]/.test(char);
const isLatinOrDigit = (char = '') => /[a-zA-Z0-9]/.test(char);
const isWhitespace = (char = '') => /\s/.test(char);
const containsChinese = (text = '') => /[\u4e00-\u9fff]/.test(text);

const isPunctuationOrSymbol = (char = '') =>
  !isChineseChar(char) &&
  !isMyanmarChar(char) &&
  !isLatinOrDigit(char) &&
  !isWhitespace(char);

function detectWholeTextType(text = '') {
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
}

function splitMixedText(text = '') {
  const wholeType = detectWholeTextType(text);
  if (wholeType !== 'mixed') {
    return [{ text: String(text).trim(), lang: wholeType || 'zh' }];
  }

  const segments = [];
  let currentText = '';
  let currentLang = null;

  const pushCurrent = () => {
    const trimmed = currentText.trim();
    if (trimmed) {
      segments.push({ text: trimmed, lang: currentLang || 'zh' });
    }
    currentText = '';
    currentLang = null;
  };

  for (const char of Array.from(text)) {
    let lang = null;

    if (isChineseChar(char)) lang = 'zh';
    else if (isMyanmarChar(char)) lang = 'my';
    else if (isLatinOrDigit(char)) lang = 'en';
    else if (isWhitespace(char) || isPunctuationOrSymbol(char)) {
      currentText += char;
      continue;
    }

    if (!currentLang) {
      currentLang = lang;
      currentText += char;
      continue;
    }

    if (lang === currentLang) {
      currentText += char;
    } else {
      pushCurrent();
      currentLang = lang;
      currentText = char;
    }
  }

  pushCurrent();

  return segments.length ? segments : [{ text: String(text).trim(), lang: 'zh' }];
}

async function getTTSBlob(text, voice, rate = 0, apiUrl = 'https://t.leftsite.cn/tts') {
  const cacheKey = `${apiUrl}-${voice}-${rate}-${text}`;
  let blob = await indexedBlobCache.get(cacheKey);

  if (!blob) {
    const response = await fetch(
      `${apiUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${rate}`
    );
    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    blob = await response.blob();
    await indexedBlobCache.set(cacheKey, blob);
  }

  return blob;
}

class AudioPlaybackController {
  constructor() {
    this.currentAudio = null;
    this.latestRequestId = 0;
    this.activeUrls = [];
  }

  stop() {
    this.latestRequestId += 1;

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
  }

  async playMixed(text, { rate = 0, aiSettings = null } = {}, onStart, onEnd) {
    this.stop();

    const raw = String(text || '').trim();
    if (!raw) {
      onEnd?.();
      return;
    }

    const requestId = this.latestRequestId;
    onStart?.();

    try {
      const segments = splitMixedText(raw);
      const audios = [];

      for (const segment of segments) {
        if (requestId !== this.latestRequestId) return;

        const segmentText = String(segment.text || '').trim();
        if (!segmentText) continue;

        const voice =
          segment.lang === 'my'
            ? aiSettings?.myVoice || TTS_VOICES.my
            : segment.lang === 'en'
            ? TTS_VOICES.en
            : aiSettings?.zhVoice || TTS_VOICES.zh;

        const blob = await getTTSBlob(
          segmentText,
          voice,
          rate,
          aiSettings?.ttsApiUrl || 'https://t.leftsite.cn/tts'
        );

        if (requestId !== this.latestRequestId) return;

        const url = URL.createObjectURL(blob);
        this.activeUrls.push(url);
        audios.push(new Audio(url));
      }

      if (requestId !== this.latestRequestId) return;

      if (!audios.length) {
        onEnd?.();
        return;
      }

      const playNext = (index) => {
        if (requestId !== this.latestRequestId) return;

        if (index >= audios.length) {
          if (requestId === this.latestRequestId) {
            this.currentAudio = null;
            onEnd?.();
          }
          return;
        }

        const audio = audios[index];
        this.currentAudio = audio;
        audio.onended = () => playNext(index + 1);
        audio.onerror = () => playNext(index + 1);
        audio.play().catch(() => playNext(index + 1));
      };

      playNext(0);
    } catch (error) {
      console.warn('[TTS Error]', error);
      if (requestId === this.latestRequestId) {
        this.currentAudio = null;
        onEnd?.();
      }
    }
  }
}

function getPinyinArraySafe(text = '') {
  const cleaned = String(text).replace(/[^\u4e00-\u9fff]/g, '');
  if (!cleaned) return [];

  try {
    return pinyin(cleaned, { type: 'array', toneType: 'symbol' });
  } catch (_) {
    return [];
  }
}

const pinyinCache = new Map();

function getCachedPinyin(text = '') {
  const key = String(text || '');
  if (!key) return '';
  if (pinyinCache.has(key)) return pinyinCache.get(key);

  let value = '';
  try {
    value = pinyin(key.replace(/[^\u4e00-\u9fff]/g, ''), { toneType: 'symbol' });
  } catch (_) {
    value = '';
  }

  pinyinCache.set(key, value);
  return value;
}

function renderTextWithOptionalPinyin(text, showPinyin, textClass = 'zh-char', pyClass = 'zh-py') {
  if (!text) return null;

  const parts =
    String(text).match(/([\u4e00-\u9fff]+|[\u1000-\u109F]+|[^\u4e00-\u9fff\u1000-\u109F]+)/g) || [];

  return parts.map((part, partIndex) => {
    if (/[\u4e00-\u9fff]/.test(part)) {
      const pinyinList = getPinyinArraySafe(part);
      return part.split('').map((char, charIndex) => (
        <div key={`${partIndex}-${charIndex}`} className="zh-seg">
          {showPinyin ? <span className={pyClass}>{pinyinList[charIndex] || ''}</span> : null}
          <span className={textClass}>{char}</span>
        </div>
      ));
    }

    if (/[\u1000-\u109F]/.test(part)) {
      return (
        <span key={partIndex} className="my-seg">
          {part}
        </span>
      );
    }

    return (
      <span key={partIndex} className="inline-seg">
        {part}
      </span>
    );
  });
}

function useTimeoutManager() {
  const timeoutsRef = useRef(new Set());

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((timer) => clearTimeout(timer));
    timeoutsRef.current.clear();
  }, []);

  const add = useCallback((fn, ms) => {
    const timer = setTimeout(() => {
      timeoutsRef.current.delete(timer);
      fn();
    }, ms);

    timeoutsRef.current.add(timer);
    return timer;
  }, []);

  useEffect(() => clearAll, [clearAll]);

  return { addTimeout: add, clearTimeouts: clearAll };
}

function useOverlayHistory() {
  const stackRef = useRef([]);

  const open = useCallback((type, setter) => {
    setter(true);

    if (typeof window === 'undefined') return;
    if (stackRef.current[stackRef.current.length - 1] === type) return;

    stackRef.current.push(type);
    window.history.pushState({ __xztOverlay: type }, '');
  }, []);

  const close = useCallback((type, setter) => {
    setter(false);
    stackRef.current = stackRef.current.filter((item) => item !== type);
  }, []);

  const closeTop = useCallback((map) => {
    const top = stackRef.current[stackRef.current.length - 1];
    if (!top) return false;

    const closer = map[top];
    if (closer) {
      closer();
      return true;
    }

    return false;
  }, []);

  const reset = useCallback(() => {
    stackRef.current = [];
  }, []);

  return {
    overlayStackRef: stackRef,
    openOverlay: open,
    closeOverlay: close,
    closeTopOverlay: closeTop,
    resetOverlayStack: reset,
  };
}

const SettingsPanel = memo(function SettingsPanel({ prefs, onPrefsChange, onClose }) {
  const updatePref = useCallback(
    (key, value) => {
      onPrefsChange((prev) => ({ ...prev, [key]: value }));
    },
    [onPrefsChange]
  );

  return (
    <div className="panel-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="panel-card relative">
        <div className="panel-header">
          <span className="panel-title">学习设置</span>
          <button className="panel-close-btn" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        <div className="settings-section-title" style={{ marginTop: 0 }}>
          显示与朗读
        </div>

        <div className="setting-row">
          <span className="setting-label">题干拼音</span>
          <div
            className="switch"
            onClick={() => updatePref('showQuestionPinyin', !prefs.showQuestionPinyin)}
            style={{ background: prefs.showQuestionPinyin ? '#58cc02' : '#cbd5e1' }}
          >
            <div
              className="switch-dot"
              style={{ left: prefs.showQuestionPinyin ? '22px' : '4px' }}
            />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">选项拼音</span>
          <div
            className="switch"
            onClick={() => updatePref('showOptionPinyin', !prefs.showOptionPinyin)}
            style={{ background: prefs.showOptionPinyin ? '#58cc02' : '#cbd5e1' }}
          >
            <div
              className="switch-dot"
              style={{ left: prefs.showOptionPinyin ? '22px' : '4px' }}
            />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">自动朗读</span>
          <div
            className="switch"
            onClick={() => updatePref('autoPlay', !prefs.autoPlay)}
            style={{ background: prefs.autoPlay ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.autoPlay ? '22px' : '4px' }} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="setting-label" style={{ marginBottom: 8 }}>
            题目语速
          </div>

          <div className="speed-group">
            {[
              { key: 'slow', label: '慢' },
              { key: 'normal', label: '正常' },
              { key: 'fast', label: '快' },
            ].map((item) => (
              <button
                key={item.key}
                className={`speed-btn ${prefs.ttsSpeed === item.key ? 'active' : ''}`}
                onClick={() => updatePref('ttsSpeed', item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

const OptionCard = memo(function OptionCard({
  option,
  isSubmitted,
  isSelected,
  isCorrectAnswer,
  isSpeaking,
  isBouncing,
  showPinyin,
  onToggle,
}) {
  const optionId = String(option.id);
  const hasImage = Boolean(option.img || option.imageUrl);

  const className = useMemo(() => {
    let cls = 'option-card';
    if (hasImage) cls += ' has-image-layout';
    if (isBouncing) cls += ' bounce-in';

    if (isSubmitted) {
      cls += ' locked';
      if (isCorrectAnswer) cls += ' correct';
      else if (isSelected) cls += ' wrong';
    } else if (isSpeaking) {
      cls += ' playing';
    } else if (isSelected) {
      cls += ' selected';
    }

    return cls;
  }, [hasImage, isBouncing, isCorrectAnswer, isSelected, isSpeaking, isSubmitted]);

  const optionPinyin = useMemo(() => {
    if (!showPinyin || !containsChinese(option.text)) return '';
    return getCachedPinyin(option.text);
  }, [option.text, showPinyin]);

  return (
    <button className={className} onClick={() => onToggle(optionId)} type="button">
      {isSpeaking ? (
        <FaSpinner className="absolute top-3 right-3 text-blue-500 animate-spin" />
      ) : null}

      {hasImage ? (
        <img
          src={option.img || option.imageUrl}
          alt="option"
          className="h-24 w-full object-cover rounded-xl mb-2"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      <div className="option-text-wrap">
        {optionPinyin ? <div className="option-py">{optionPinyin}</div> : null}
        <span className="option-text">{option.text}</span>
      </div>
    </button>
  );
});

export default function XuanZeTi({
  data: rawData,
  onCorrect,
  onWrong,
  onNext,
  onOverlayChange,
}) {
  const data = rawData?.content || rawData || {};
  const question = data.question || {};
  const questionText = typeof question === 'string' ? question : question.text || '';
  const questionImg = data.imageUrl || '';
  const options = Array.isArray(data.options) ? data.options : [];

  const correctAnswers = useMemo(() => {
    const raw = data.correctAnswer || [];
    return (Array.isArray(raw) ? raw : [raw]).map(String);
  }, [data.correctAnswer]);

  const optionShuffleKey = useMemo(() => {
    const optionIds = options.map((opt) => String(opt.id)).join('|');
    return `${data?.id || questionText}__${optionIds}`;
  }, [data?.id, options, questionText]);

  const shuffledOptions = useMemo(() => {
    const nextOptions = [...options];
    for (let i = nextOptions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [nextOptions[i], nextOptions[j]] = [nextOptions[j], nextOptions[i]];
    }
    return nextOptions;
  }, [optionShuffleKey]);

  const hasOptionImages = useMemo(
    () => shuffledOptions.some((opt) => opt.img || opt.imageUrl),
    [shuffledOptions]
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [speakingOptionId, setSpeakingOptionId] = useState(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cardPopId, setCardPopId] = useState(null);
  const [questionImgVisible, setQuestionImgVisible] = useState(Boolean(questionImg));

  const [prefs, setPrefs] = useState(() => getSavedInteractivePrefs());
  const [aiSettings, setAISettings] = useState(() => getSavedInteractiveAISettings());

  const audioControllerRef = useRef(new AudioPlaybackController());
  const mountedRef = useRef(false);

  const { addTimeout, clearTimeouts } = useTimeoutManager();
  const { openOverlay, closeOverlay, closeTopOverlay, resetOverlayStack } = useOverlayHistory();

  const hasOverlayOpen = showSettings;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      audioControllerRef.current.stop();
      clearTimeouts();
      resetOverlayStack();
    };
  }, [clearTimeouts, resetOverlayStack]);

  useEffect(() => {
    onOverlayChange?.(hasOverlayOpen);
    return () => {
      onOverlayChange?.(false);
    };
  }, [hasOverlayOpen, onOverlayChange]);

  useEffect(() => {
    saveInteractivePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    saveInteractiveAISettings(aiSettings);
  }, [aiSettings]);

  useEffect(() => {
    setQuestionImgVisible(Boolean(questionImg));
  }, [questionImg]);

  const currentRate = useMemo(() => speedLabelToRate(prefs.ttsSpeed), [prefs.ttsSpeed]);

  const hasMyanmar = useMemo(() => /[\u1000-\u109F]/.test(questionText), [questionText]);
  const questionLength = String(questionText || '').trim().length;
  const isLongQuestion = questionLength > 24;
  const isVeryLongQuestion = questionLength > 40;
  const shouldHideQuestionPinyin = hasMyanmar || isLongQuestion;

  const questionTextClass = useMemo(
    () =>
      [
        'bubble-text',
        hasMyanmar ? 'is-myanmar' : '',
        isLongQuestion ? 'is-long' : '',
        isVeryLongQuestion ? 'is-very-long' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [hasMyanmar, isLongQuestion, isVeryLongQuestion]
  );

  const stopAllAudio = useCallback(() => {
    audioControllerRef.current.stop();
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);
  }, []);

  const feedbackTap = useCallback(() => {
    if (aiSettings.vibration) vibrate(15);
    if (aiSettings.soundFx) playBeep('tap');
  }, [aiSettings.soundFx, aiSettings.vibration]);

  const feedbackCorrect = useCallback(() => {
    if (aiSettings.vibration) vibrate([30, 40, 30]);
    if (aiSettings.soundFx) playBeep('correct');
  }, [aiSettings.soundFx, aiSettings.vibration]);

  const feedbackWrong = useCallback(() => {
    if (aiSettings.vibration) vibrate([40, 40, 40]);
    if (aiSettings.soundFx) playBeep('wrong');
  }, [aiSettings.soundFx, aiSettings.vibration]);

  const playQuestion = useCallback(() => {
    if (!questionText) return;

    setSpeakingOptionId(null);
    audioControllerRef.current.playMixed(
      questionText,
      { rate: currentRate, aiSettings },
      () => mountedRef.current && setIsQuestionPlaying(true),
      () => mountedRef.current && setIsQuestionPlaying(false)
    );
  }, [aiSettings, currentRate, questionText]);

  const playOptionText = useCallback(
    (optionId, optionText) => {
      if (!optionText) return;

      setIsQuestionPlaying(false);
      audioControllerRef.current.playMixed(
        optionText,
        { rate: currentRate, aiSettings },
        () => mountedRef.current && setSpeakingOptionId(optionId),
        () => mountedRef.current && setSpeakingOptionId(null)
      );
    },
    [aiSettings, currentRate]
  );

  useEffect(() => {
    clearTimeouts();
    stopAllAudio();

    setSelectedIds([]);
    setIsSubmitted(false);
    setIsRight(false);
    setShowResultSheet(false);
    setShowSettings(false);
    setCardPopId(null);
    resetOverlayStack();

    if (questionText && prefs.autoPlay) {
      addTimeout(() => {
        audioControllerRef.current.playMixed(
          questionText,
          { rate: currentRate, aiSettings },
          () => mountedRef.current && setIsQuestionPlaying(true),
          () => mountedRef.current && setIsQuestionPlaying(false)
        );
      }, 260);
    }
  }, [
    addTimeout,
    aiSettings,
    clearTimeouts,
    currentRate,
    optionShuffleKey,
    prefs.autoPlay,
    questionText,
    resetOverlayStack,
    stopAllAudio,
  ]);

  const closeSettings = useCallback(() => {
    closeOverlay('settings', setShowSettings);
  }, [closeOverlay]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onPopState = () => {
      closeTopOverlay({
        'settings': closeSettings,
      });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [closeSettings, closeTopOverlay]);

  const toggleOption = useCallback(
    (optionId) => {
      if (isSubmitted) return;

      feedbackTap();

      if (correctAnswers.length === 1) {
        setSelectedIds([optionId]);
      } else {
        setSelectedIds((prev) =>
          prev.includes(optionId) ? prev.filter((item) => item !== optionId) : [...prev, optionId]
        );
      }

      setCardPopId(optionId);
      addTimeout(() => {
        if (mountedRef.current) {
          setCardPopId((prev) => (prev === optionId ? null : prev));
        }
      }, 180);

      const option = shuffledOptions.find((item) => String(item.id) === optionId);
      if (option?.text) {
        playOptionText(optionId, option.text);
      }
    },
    [
      addTimeout,
      correctAnswers.length,
      feedbackTap,
      isSubmitted,
      playOptionText,
      shuffledOptions,
    ]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedIds.length || isSubmitted) return;

    const correct =
      selectedIds.length === correctAnswers.length &&
      selectedIds.every((id) => correctAnswers.includes(id));

    setIsRight(correct);
    setIsSubmitted(true);
    stopAllAudio();

    if (correct) {
      feedbackCorrect();
      onCorrect?.();
    } else {
      feedbackWrong();
      onWrong?.();
    }

    setShowResultSheet(true);
  }, [
    correctAnswers,
    feedbackCorrect,
    feedbackWrong,
    isSubmitted,
    onCorrect,
    onWrong,
    selectedIds,
    stopAllAudio,
  ]);

  const handleOpenSettings = useCallback(() => {
    openOverlay('settings', setShowSettings);
  }, [openOverlay]);

  // ====================== 核心改动：跳转 DeepSeek 并带参数 ======================
  const handleOpenDeepSeekWeb = useCallback(() => {
    stopAllAudio();

    const wrongText = shuffledOptions.find(o => selectedIds.includes(String(o.id)))?.text || '';
    const correctText = shuffledOptions.find(o => correctAnswers.includes(String(o.id)))?.text || '';
    const prompt = [
      '我正在学习语言，这道选择题我答错了，请你用中文详细讲解语法点和词汇用法：',
      `【题目】${questionText}`,
      `【我的选择】${wrongText}`,
      `【正确答案】${correctText}`,
      '请以严厉但温柔的私教口吻，分析错误原因，对比正确选项与错误选项的区别，并提示记忆要点。',
    ].join('\n');

    // 打开 DeepSeek，附带 auto_prompt 参数，由油猴脚本自动填入并发送
    window.open(`https://chat.deepseek.com/?auto_prompt=${encodeURIComponent(prompt)}`, '_blank');
  }, [stopAllAudio, questionText, shuffledOptions, selectedIds, correctAnswers]);

  return (
    <div className={`xzt-container ${hasOverlayOpen ? 'settings-open' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div className="xzt-header">
        <div className="w-full relative">
          <div className="top-hint-row">
            <div className="top-left-text">请选择正确答案</div>

            <div className="top-actions">
              <button className="settings-btn" onClick={handleOpenSettings} type="button">
                <FaCog size={18} />
              </button>
            </div>
          </div>

          <div className="scene-wrapper">
            <img
              src={TEACHER_IMAGE_URL}
              className="teacher-img"
              alt="Teacher"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />

            <div className="question-zone">
              <div className="bubble-container">
                <div className="bubble-tail" />

                {questionText ? (
                  <button
                    className={`bubble-audio-btn ${isQuestionPlaying ? 'playing' : ''}`}
                    onClick={playQuestion}
                    aria-label="播放题干"
                    type="button"
                  >
                    {isQuestionPlaying ? (
                      <FaSpinner className="animate-spin" size={12} />
                    ) : (
                      <FaVolumeUp size={12} />
                    )}
                  </button>
                ) : null}

                <div className={questionTextClass}>
                  {renderTextWithOptionalPinyin(
                    questionText,
                    prefs.showQuestionPinyin && !shouldHideQuestionPinyin,
                    'zh-char',
                    'zh-py'
                  )}
                </div>
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
          {shuffledOptions.map((option) => {
            const optionId = String(option.id);

            return (
              <OptionCard
                key={optionId}
                option={option}
                isSubmitted={isSubmitted}
                isSelected={selectedIds.includes(optionId)}
                isCorrectAnswer={correctAnswers.includes(optionId)}
                isSpeaking={speakingOptionId === optionId}
                isBouncing={cardPopId === optionId}
                showPinyin={prefs.showOptionPinyin}
                onToggle={toggleOption}
              />
            );
          })}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="submit-bar">
          <button
            className="submit-btn"
            disabled={!selectedIds.length}
            onClick={handleSubmit}
            type="button"
          >
            检查答案
          </button>
        </div>
      ) : null}

      <div
        className={`result-sheet ${showResultSheet ? 'show' : ''} ${
          isRight ? 'correct' : 'wrong'
        }`}
      >
        <div className="sheet-header">
          {isRight ? <FaCheck /> : <FaTimes />}
          <span>{isRight ? '答对了！' : '再试试看'}</span>
        </div>

        <div className="sheet-sub">
          {isRight ? '太棒了，继续前进。' : '你已经很接近正确答案了。'}
        </div>

        {!isRight ? (
          <button className="ai-btn" onClick={handleOpenDeepSeekWeb} type="button">
            <FaRobot /> AI 自动提问到 DeepSeek
          </button>
        ) : null}

        <button
          className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`}
          onClick={() => {
            stopAllAudio();
            onNext?.();
          }}
          type="button"
        >
          继续 <FaArrowRight />
        </button>
      </div>

      {showSettings ? (
        <SettingsPanel prefs={prefs} onPrefsChange={setPrefs} onClose={closeSettings} />
      ) : null}
    </div>
  );
}

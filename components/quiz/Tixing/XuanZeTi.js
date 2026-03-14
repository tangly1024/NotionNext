import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRobot,
  FaCog
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';

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
// 2. 文本与 TTS 工具
// =================================================================================
const TTS_VOICES = {
  zh: 'zh-CN-XiaoxiaoMultilingualNeural',
  my: 'my-MM-ThihaNeural',
  en: 'en-US-JennyNeural'
};

const RATE_MAP = {
  slow: -30,
  normal: 0,
  fast: 20
};

const PREFS_STORAGE_KEY = 'quiz_choice_prefs_v1';

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

async function getTTSBlob(text, voice, rate = 0) {
  const cacheKey = `${voice}-${rate}-${text}`;
  let blob = await idb.get(cacheKey);

  if (!blob) {
    const res = await fetch(
      `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${rate}`
    );
    if (!res.ok) throw new Error('TTS Failed');
    blob = await res.blob();
    await idb.set(cacheKey, blob);
  }

  return blob;
}

// =================================================================================
// 3. 中缅混合 TTS 播放引擎
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

  async playMixed(text, { rate = 0 } = {}, onStart, onEnd) {
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
            ? TTS_VOICES.my
            : seg.lang === 'en'
            ? TTS_VOICES.en
            : TTS_VOICES.zh;

        const blob = await getTTSBlob(segText, voice, rate);
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
// 4. 样式
// =================================================================================
const cssStyles = `
.xzt-container { font-family: "Padauk","Noto Sans SC",sans-serif; display:flex; flex-direction:column; background:transparent; width:100%; height:100%; position:relative; }
.xzt-header { flex-shrink:0; padding:14px 16px 6px; display:flex; justify-content:center; }
.top-hint-row { width:100%; display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:8px; }

.top-left-text { font-size:14px; font-weight:900; color:#334155; line-height:1.2; }
.top-actions { display:flex; align-items:center; gap:8px; }
.settings-btn { width:38px; height:38px; border-radius:9999px; background:#fff; border:2px solid #e5e7eb; display:flex; align-items:center; justify-content:center; color:#64748b; box-shadow:0 3px 10px rgba(0,0,0,0.05); cursor:pointer; }

.scene-wrapper { width:100%; display:flex; align-items:flex-end; gap:12px; }
.teacher-img { height:130px; object-fit:contain; flex-shrink:0; }
.bubble-container { flex:1; background:#fff; border-radius:22px; padding:14px 14px; border:2px solid #e5e7eb; position:relative; display:flex; align-items:center; justify-content:space-between; gap:10px; box-shadow:0 6px 14px rgba(0,0,0,0.05); }
.bubble-tail { position:absolute; bottom:18px; left:-10px; width:0; height:0; border-top:8px solid transparent; border-bottom:8px solid transparent; border-right:10px solid #e5e7eb; }
.bubble-tail::after { content:''; position:absolute; top:-6px; left:2px; border-top:6px solid transparent; border-bottom:6px solid transparent; border-right:8px solid #fff; }

.zh-seg { display:inline-flex; flex-direction:column; align-items:center; margin:0 1px; }
.zh-py { font-size:.68rem; color:#94a3b8; line-height:1; font-family:Arial, sans-serif; font-weight:700; margin-bottom:2px; }
.zh-char { font-size:1.42rem; font-weight:900; color:#1e293b; line-height:1.15; }
.my-seg { font-size:1.05rem; font-weight:700; color:#334155; white-space:pre-wrap; }
.bubble-play-btn { flex-shrink:0; width:44px; height:44px; border-radius:9999px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:inset 0 -2px 0 rgba(0,0,0,0.06); }

.settings-pop { position:absolute; top:52px; right:0; z-index:120; width:232px; background:#fff; border:2px solid #e5e7eb; border-radius:20px; box-shadow:0 14px 30px rgba(15,23,42,0.12); padding:12px; }
.settings-section-title { font-size:11px; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:10px; }
.setting-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 2px; }
.setting-label { font-size:13px; font-weight:900; color:#334155; }
.switch { width:42px; height:24px; border-radius:9999px; position:relative; transition:all .2s; cursor:pointer; }
.switch-dot { position:absolute; top:3px; width:16px; height:16px; border-radius:9999px; background:#fff; transition:all .2s; box-shadow:0 1px 4px rgba(0,0,0,.15); }
.speed-group { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:6px; }
.speed-btn { border:2px solid #e5e7eb; background:#fff; color:#64748b; border-radius:12px; font-size:12px; font-weight:900; padding:10px 0; cursor:pointer; }
.speed-btn.active { background:#ecfccb; border-color:#bef264; color:#3f6212; }

.question-image { width:100%; max-width:280px; border-radius:18px; margin-bottom:14px; border:2px solid #f1f5f9; box-shadow:0 4px 12px rgba(0,0,0,0.05); }

.xzt-scroll-area { flex:1; overflow-y:auto; padding:8px 16px 132px; display:flex; flex-direction:column; align-items:center; -webkit-overflow-scrolling:touch; }
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
.option-text { font-weight:900; text-align:center; line-height:1.35; font-size:1.08rem; }

.submit-bar { position:absolute; bottom:0; left:0; right:0; padding:14px 16px calc(16px + env(safe-area-inset-bottom)); border-top:2px solid #f3f4f6; background:#fff; display:flex; justify-content:center; z-index:50; }
.submit-btn { width:100%; max-width:520px; background:#58cc02; color:white; padding:16px; border-radius:18px; font-size:1.15rem; font-weight:900; border:none; border-bottom:5px solid #46a302; transition:all .1s; -webkit-tap-highlight-color:transparent; cursor:pointer; box-shadow:0 6px 0 #46a302; }
.submit-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:0 2px 0 #46a302; }
.submit-btn:disabled { background:#e5e5e5; color:#9ca3af; border-bottom-color:#d1d5db; box-shadow:0 6px 0 #d1d5db; cursor:not-allowed; transform:none; }

.result-sheet { position:absolute; bottom:0; left:0; right:0; padding:20px 20px calc(22px + env(safe-area-inset-bottom)); border-top-left-radius:28px; border-top-right-radius:28px; transform:translateY(110%); transition:transform .34s cubic-bezier(0.34,1.56,0.64,1); z-index:100; display:flex; flex-direction:column; gap:14px; box-shadow:0 -10px 32px rgba(0,0,0,0.1); }
.result-sheet.correct { background:#dcfce7; color:#166534; }
.result-sheet.wrong { background:#fff5f5; color:#c2410c; }
.result-sheet.show { transform:translateY(0); }

.sheet-header { font-size:1.55rem; font-weight:900; display:flex; align-items:center; gap:12px; }
.sheet-sub { font-size:13px; font-weight:800; opacity:.8; }

.next-btn { width:100%; padding:16px; border-radius:18px; border:none; color:#fff; font-weight:900; font-size:1.15rem; cursor:pointer; border-bottom:5px solid rgba(0,0,0,0.15); -webkit-tap-highlight-color:transparent; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 0 rgba(0,0,0,0.14); }
.next-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:0 2px 0 rgba(0,0,0,0.14); }
.btn-correct { background:#58cc02; border-bottom-color:#46a302; box-shadow:0 6px 0 #46a302; }
.btn-wrong { background:#ff7878; border-bottom-color:#ef5b5b; box-shadow:0 6px 0 #ef5b5b; }

.ai-btn { background:#fff; border:2px solid #e5e7eb; color:#4f46e5; padding:13px; border-radius:16px; font-weight:900; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; font-size:1rem; cursor:pointer; }
.ai-btn:disabled { opacity:.7; cursor:not-allowed; }

.bounce-in { animation: xzt-bounce .28s ease-out; }
@keyframes xzt-bounce {
  0% { transform: scale(0.97); }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
`;

const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

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

function getSavedPrefs() {
  if (typeof window === 'undefined') {
    return {
      showQuestionPinyin: true,
      showOptionPinyin: false,
      autoPlay: true,
      rateMode: 'normal'
    };
  }

  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) {
      return {
        showQuestionPinyin: true,
        showOptionPinyin: false,
        autoPlay: true,
        rateMode: 'normal'
      };
    }
    return {
      showQuestionPinyin: true,
      showOptionPinyin: false,
      autoPlay: true,
      rateMode: 'normal',
      ...JSON.parse(raw)
    };
  } catch (_) {
    return {
      showQuestionPinyin: true,
      showOptionPinyin: false,
      autoPlay: true,
      rateMode: 'normal'
    };
  }
}

function MiniSettings({ prefs, setPrefs, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[110]" onClick={onClose} />
      <div className="settings-pop bounce-in">
        <div className="settings-section-title">Learning Aids</div>

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
          <div className="setting-label" style={{ marginBottom: 8 }}>语速</div>
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
      </div>
    </>
  );
}

// =================================================================================
// 5. 组件主体
// =================================================================================
export default function XuanZeTi({ data: rawData, onCorrect, onWrong, onNext, triggerAI }) {
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
  const [aiLoading, setAiLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cardPopId, setCardPopId] = useState(null);
  const [questionImgVisible, setQuestionImgVisible] = useState(Boolean(questionImg));

  const [prefs, setPrefs] = useState(() => getSavedPrefs());

  const timersRef = useRef([]);
  const mountedRef = useRef(true);

  const addTimer = (fn, ms) => {
    const timer = setTimeout(fn, ms);
    timersRef.current.push(timer);
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) {}
  }, [prefs]);

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
    setAiLoading(false);
    setShowSettings(false);
    setCardPopId(null);

    if (questionText && prefs.autoPlay) {
      addTimer(() => {
        audioController.playMixed(
          questionText,
          { rate: currentRate },
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

  const playQuestion = () => {
    if (!questionText) return;
    setSpeakingOptionId(null);
    audioController.playMixed(
      questionText,
      { rate: currentRate },
      () => mountedRef.current && setIsQuestionPlaying(true),
      () => mountedRef.current && setIsQuestionPlaying(false)
    );
  };

  const toggleOption = (id) => {
    if (isSubmitted) return;

    vibrate(15);
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
        { rate: currentRate },
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
      vibrate([30, 40, 30]);
      onCorrect?.();
    } else {
      vibrate([40, 40, 40]);
      onWrong?.();
    }

    setShowResultSheet(true);
  };

  const handleAI = async () => {
    if (!triggerAI || aiLoading) return;

    try {
      setAiLoading(true);

      await Promise.resolve(
        triggerAI({
          scene: 'interactive_explainer',
          type: 'choice',
          payload: {
            questionText,
            questionImg,
            options: shuffledOptions,
            selectedIds,
            correctAnswers,
            isRight,
            rawData: data
          }
        })
      );
    } catch (err) {
      console.warn('[AI trigger error]:', err);
    } finally {
      if (mountedRef.current) setAiLoading(false);
    }
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
                <FaCog size={16} />
              </button>
            </div>
          </div>

          {showSettings && (
            <MiniSettings
              prefs={prefs}
              setPrefs={setPrefs}
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
                    background: isQuestionPlaying ? '#1d4ed8' : '#eff6ff',
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
          </div>
        </div>
      </div>

      <div className="xzt-scroll-area">
        {questionImg && questionImgVisible ? (
          <img
            src={questionImg}
            alt="question"
            className="question-image"
            onError={() => setQuestionImgVisible(false)}
          />
        ) : null}

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

        {!isRight && triggerAI && (
          <button className="ai-btn" disabled={aiLoading} onClick={handleAI}>
            {aiLoading ? <FaSpinner className="animate-spin" /> : <FaRobot />}
            解释一下
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
    </div>
  );
}

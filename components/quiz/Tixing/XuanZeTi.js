import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaVolumeUp, FaCheck, FaTimes, FaArrowRight, FaSpinner, FaRobot } from 'react-icons/fa';
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
  en: 'zh-CN-XiaoxiaoMultilingualNeural'
};

const isChineseChar = (ch = '') => /[\u4e00-\u9fff]/.test(ch);
const isMyanmarChar = (ch = '') => /[\u1000-\u109F]/.test(ch);
const isLatinOrDigit = (ch = '') => /[a-zA-Z0-9]/.test(ch);
const isWhitespace = (ch = '') => /\s/.test(ch);

// 标点/符号：不单独作为一个 TTS 片段，而是挂靠到前后文本
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

// 中/缅/英混合分段：
// 1) 纯中文/纯缅文/纯英文整句播
// 2) 混合时才按语言类型切段
// 3) 标点不单独切出来，而是尽量附着到前一个 segment
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
      // 空格：附着到当前段，不主动开新段
      currentText += ch;
      continue;
    } else if (isPunctuationOrSymbol(ch)) {
      // 标点：附着到当前段，避免被拆出去
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

  // 如果由于某些特殊情况产生空数组，兜底整句中文播放
  if (!segments.length && text.trim()) {
    return [{ text: text.trim(), lang: 'zh' }];
  }

  return segments;
}

async function getTTSBlob(text, voice) {
  const cacheKey = `${voice}-${text}`;
  let blob = await idb.get(cacheKey);

  if (!blob) {
    const res = await fetch(
      `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${voice}&r=0`
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

  async playMixed(text, onStart, onEnd) {
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

        const blob = await getTTSBlob(segText, voice);
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
// 4. 页面样式
// =================================================================================
const cssStyles = `
.xzt-container { font-family: "Padauk","Noto Sans SC",sans-serif; display: flex; flex-direction: column; background: transparent; width: 100%; height: 100%; position: relative; }
.xzt-header { flex-shrink: 0; padding: 20px 20px 10px; display: flex; justify-content: center; }
.scene-wrapper { width: 100%; display: flex; align-items: flex-end; gap: 12px; }
.teacher-img { height: 120px; object-fit: contain; flex-shrink: 0; }
.bubble-container { flex: 1; background: #fff; border-radius: 18px; padding: 14px 16px; border: 2px solid #e5e7eb; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.bubble-tail { position: absolute; bottom: 20px; left: -10px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 10px solid #e5e7eb; }
.bubble-tail::after { content: ''; position: absolute; top: -6px; left: 2px; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 8px solid #fff; }
.zh-seg { display: inline-flex; flex-direction: column; align-items: center; margin: 0 1px; }
.zh-py { font-size: .8rem; color: #64748b; line-height: 1; font-family: Arial, sans-serif; }
.zh-char { font-size: 1.5rem; font-weight: 900; color: #1e293b; line-height: 1.2; }
.my-seg { font-size: 1.2rem; font-weight: 600; color: #334155; white-space: pre-wrap; }
.xzt-scroll-area { flex: 1; overflow-y: auto; padding: 10px 16px 120px; display: flex; flex-direction: column; align-items: center; -webkit-overflow-scrolling: touch; }
.options-grid { width: 100%; display: grid; gap: 12px; grid-template-columns: 1fr; }
.options-grid.has-images { grid-template-columns: 1fr 1fr; }
.option-card { background: #fff; border-radius: 16px; padding: 16px; border: 2px solid #e5e7eb; border-bottom-width: 4px; cursor: pointer; transition: all .1s ease; display: flex; align-items: center; justify-content: center; min-height: 60px; position: relative; user-select: none; -webkit-tap-highlight-color: transparent; }
.option-card:active { transform: translateY(2px); border-bottom-width: 2px; }
.option-card.selected { border-color: #84cc16; background: #f7fee7; color: #4d7c0f; }
.option-card.playing { border-color: #60a5fa; background: #eff6ff; color: #1d4ed8; }
.option-card.correct { border-color: #84cc16; background: #d9f99d; color: #365314; }
.option-card.wrong { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
.option-card.locked { cursor: default; transform: none; }
.option-card.has-image-layout { flex-direction: column; align-items: stretch; justify-content: flex-start; padding: 12px; }
.option-text { font-weight: 800; text-align: center; line-height: 1.35; font-size: 1.15rem; }
.option-play-dot { position: absolute; top: 8px; right: 10px; font-size: 14px; opacity: .85; }
.submit-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); border-top: 2px solid #f3f4f6; background: #fff; display: flex; justify-content: center; z-index: 50; }
.submit-btn { width: 100%; max-width: 500px; background: #58cc02; color: white; padding: 16px; border-radius: 16px; font-size: 1.2rem; font-weight: 900; text-transform: uppercase; border: none; border-bottom: 4px solid #46a302; transition: all 0.1s; -webkit-tap-highlight-color: transparent; cursor: pointer; }
.submit-btn:active { transform: translateY(4px); border-bottom-width: 0; margin-bottom: 4px; }
.submit-btn:disabled { background: #e5e7eb; color: #9ca3af; border-bottom-color: #d1d5db; cursor: not-allowed; transform: none; margin-bottom: 0; }
.result-sheet { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 24px calc(24px + env(safe-area-inset-bottom)); border-top-left-radius: 24px; border-top-right-radius: 24px; transform: translateY(110%); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 100; display: flex; flex-direction: column; gap: 16px; }
.result-sheet.correct { background: #dcfce7; color: #166534; }
.result-sheet.wrong { background: #fee2e2; color: #991b1b; }
.result-sheet.show { transform: translateY(0); box-shadow: 0 -10px 40px rgba(0,0,0,0.1); }
.sheet-header { font-size: 1.6rem; font-weight: 900; display: flex; align-items: center; gap: 12px; }
.next-btn { width: 100%; padding: 16px; border-radius: 16px; border: none; color: #fff; font-weight: 900; text-transform: uppercase; font-size: 1.2rem; cursor: pointer; border-bottom: 4px solid rgba(0,0,0,0.2); -webkit-tap-highlight-color: transparent; display: flex; align-items: center; justify-content: center; gap: 8px; }
.next-btn:active { transform: translateY(4px); border-bottom-width: 0; margin-bottom: 4px; }
.btn-correct { background: #58cc02; border-bottom-color: #46a302; }
.btn-wrong { background: #ef4444; border-bottom-color: #b91c1c; }
.ai-btn { background: #fff; border: 2px solid #e5e7eb; color: #4f46e5; padding: 12px; border-radius: 16px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; font-size: 1rem; cursor: pointer; }
.ai-btn:disabled { opacity: .7; cursor: not-allowed; }
`;

// 工具：安全震动
const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

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

  // 初始化与自动播放
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

    if (questionText) {
      addTimer(() => {
        audioController.playMixed(
          questionText,
          () => mountedRef.current && setIsQuestionPlaying(true),
          () => mountedRef.current && setIsQuestionPlaying(false)
        );
      }, 300);
    }

    return () => {
      clearTimers();
      audioController.stop();
    };
  }, [data?.id, questionText]);

  const playQuestion = () => {
    if (!questionText) return;
    setSpeakingOptionId(null);
    audioController.playMixed(
      questionText,
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

    const opt = options.find((o) => String(o.id) === sid);
    if (opt?.text) {
      setIsQuestionPlaying(false);
      audioController.playMixed(
        opt.text,
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
      vibrate([30, 50, 30]);
      if (typeof window !== 'undefined') {
        const { default: confetti } = await import('canvas-confetti');
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }
      onCorrect?.();
    } else {
      vibrate([50, 50, 50]);
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
          scene: 'choice',
          questionText,
          questionImg,
          options: shuffledOptions,
          selectedIds,
          correctAnswers,
          isRight,
          rawData: data
        })
      );
    } catch (err) {
      console.warn('[AI trigger error]:', err);
    } finally {
      if (mountedRef.current) setAiLoading(false);
    }
  };

  const renderRichText = (text) => {
    if (!text) return null;
    const parts = text.match(/([\u4e00-\u9fff]+|[^\u4e00-\u9fff]+)/g) || [];

    return parts.map((part, i) => {
      if (/[\u4e00-\u9fff]/.test(part)) {
        const py = pinyin(part, { type: 'array', toneType: 'symbol' });
        return part.split('').map((char, j) => (
          <div key={`${i}-${j}`} className="zh-seg">
            <span className="zh-py">{py[j] || ''}</span>
            <span className="zh-char">{char}</span>
          </div>
        ));
      }
      return (
        <span key={i} className="my-seg">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="xzt-container">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div className="xzt-header">
        <div className="scene-wrapper">
          <img
            src="/images/laoshi.png"
            className="teacher-img"
            alt="Teacher"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />

          <div className="bubble-container">
            <div className="bubble-tail" />

            <div className="flex-1 flex flex-wrap items-end gap-1">
              {renderRichText(questionText)}
            </div>

            {questionText && (
              <div
                className={`p-3 rounded-2xl cursor-pointer ${
                  isQuestionPlaying ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
                }`}
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

      <div className="xzt-scroll-area">
        <div className={`options-grid ${hasOptionImages ? 'has-images' : ''}`}>
          {shuffledOptions.map((opt) => {
            const sid = String(opt.id);
            const isSel = selectedIds.includes(sid);
            const isCorrectAns = correctAnswers.includes(sid);

            let cls = 'option-card';
            if (opt.img || opt.imageUrl) cls += ' has-image-layout';

            if (isSubmitted) {
              cls += ' locked';
              if (isCorrectAns) cls += ' correct';
              else if (isSel) cls += ' wrong';
            } else {
              if (speakingOptionId === sid) cls += ' playing';
              else if (isSel) cls += ' selected';
            }

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
                  />
                )}

                <span className="option-text">{opt.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!isSubmitted && (
        <div className="submit-bar">
          <button className="submit-btn" disabled={!selectedIds.length} onClick={handleSubmit}>
            စစ်ဆေးမည် (CHECK)
          </button>
        </div>
      )}

      <div className={`result-sheet ${showResultSheet ? 'show' : ''} ${isRight ? 'correct' : 'wrong'}`}>
        <div className="sheet-header">
          {isRight ? <FaCheck /> : <FaTimes />}
          <span>{isRight ? 'မှန်ပါတယ်!' : 'မှားနေပါတယ်'}</span>
        </div>

        {!isRight && triggerAI && (
          <button className="ai-btn" disabled={aiLoading} onClick={handleAI}>
            {aiLoading ? <FaSpinner className="animate-spin" /> : <FaRobot />}
            AI ရှင်းလင်းချက်
          </button>
        )}

        <button
          className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`}
          onClick={() => {
            audioController.stop();
            onNext?.();
          }}
        >
          ဆက်သွားမည် <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

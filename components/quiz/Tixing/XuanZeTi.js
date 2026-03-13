import React, { useState, useEffect, useRef, useMemo } from 'react';
// import confetti from 'canvas-confetti';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRobot
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';

// =================================================================================
// 1) IndexedDB 缓存 (优秀设计，保留并规范化)
// =================================================================================
const DB_NAME = 'LessonCacheDB';
const STORE_NAME = 'tts_audio';

const idb = {
  db: null,
  async init() {
    if (typeof window === 'undefined' || this.db) return;
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
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
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },
  async set(key, blob) {
    await this.init();
    if (!this.db) return;
    const tx = this.db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
  }
};

// =================================================================================
// 2) 音频控制器 (增强版：内存安全与请求中断)
// =================================================================================
const TTS_TIMEOUT = 10000;

const fetchWithTimeout = async (url, options = {}, timeout = TTS_TIMEOUT) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const audioController = {
  currentAudio: null,
  latestRequestId: 0,
  activeUrls: [],

  stop() {
    this.latestRequestId++; // 增加请求ID，直接作废之前的异步队列
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    // 清理内存
    this.activeUrls.forEach((url) => URL.revokeObjectURL(url));
    this.activeUrls = [];
  },

  async playMixed(text, settings = {}, onStart, onEnd, onSegmentStart) {
    this.stop();
    if (!text?.trim()) return;

    const reqId = this.latestRequestId;
    onStart?.();

    // 根据中缅英文和空格分段
    const regex = /([\u4e00-\u9fa5]+|[\u1000-\u109F\s]+|[a-zA-Z0-9\s]+|[^\s])/g;
    const segments = text.match(regex) || [text];

    try {
      const audios = [];
      for (const segRaw of segments) {
        const seg = (segRaw || '').trim();
        if (!seg) continue;
        if (reqId !== this.latestRequestId) return; // 如果在获取音频时被中断，立即停止

        const isMy = /[\u1000-\u109F]/.test(seg);
        const voice = isMy ? 'my-MM-ThihaNeural' : (settings.voice || 'zh-CN-XiaoyouNeural');
        const cacheKey = `${voice}-${seg}`;

        let blob = await idb.get(cacheKey);
        if (!blob) {
          const res = await fetchWithTimeout(`/api/tts?t=${encodeURIComponent(seg)}&v=${voice}`);
          if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
          blob = await res.blob();
          await idb.set(cacheKey, blob);
        }

        const url = URL.createObjectURL(blob);
        this.activeUrls.push(url);

        const audio = new Audio(url);
        if (!isMy) audio.playbackRate = settings.speed || 1.0;
        audios.push({ audio, segment: seg });
      }

      // 递归播放队列
      const playNext = (i) => {
        if (reqId !== this.latestRequestId) return;
        if (i >= audios.length) {
          onEnd?.();
          return;
        }
        const item = audios[i];
        this.currentAudio = item.audio;
        onSegmentStart?.({ segment: item.segment, index: i, total: audios.length });

        item.audio.onended = () => playNext(i + 1);
        item.audio.onerror = () => playNext(i + 1);
        item.audio.play().catch(() => playNext(i + 1));
      };

      playNext(0);
    } catch (e) {
      console.warn('[TTS] playMixed failed:', e);
      onEnd?.();
    }
  }
};

// =================================================================================
// 3) 样式字符串 (后续将在组件内注入)
// =================================================================================
const cssStyles = `
.xzt-container { font-family: "Padauk","Noto Sans SC",sans-serif; position: absolute; inset: 0; display: flex; flex-direction: column; background: #fff; height: 100dvh; overflow: hidden; }
.xzt-header { flex-shrink: 0; padding: 40px 20px 10px; display: flex; justify-content: center; }
.scene-wrapper { width: 100%; max-width: 600px; display: flex; align-items: center; gap: 16px; }
.teacher-img { height: 140px; object-fit: contain; mix-blend-mode: multiply; flex-shrink: 0; }
.bubble-container { flex: 1; background: #fff; border-radius: 18px; padding: 12px 16px; border: 2px solid #e5e7eb; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
.bubble-tail { position: absolute; top: 50%; left: -10px; transform: translateY(-50%); width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 10px solid #e5e7eb; }
.bubble-tail::after { content: ''; position: absolute; top: -6px; left: 2px; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 8px solid #fff; }
.zh-seg { display: inline-flex; flex-direction: column; align-items: center; margin: 0 1px; }
.zh-py { font-size: .8rem; color: #64748b; line-height: 1.1; font-family: Arial, sans-serif; }
.zh-char { font-size: 1.4rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
.my-seg { font-size: 1.1rem; font-weight: 600; color: #334155; white-space: pre-wrap; }
.xzt-scroll-area { flex: 1; overflow-y: auto; padding: 10px 16px 200px; display: flex; flex-direction: column; align-items: center; }
.options-grid { width: 100%; max-width: 600px; display: grid; gap: 12px; margin-top: 10px; grid-template-columns: 1fr; }
.options-grid.has-images { grid-template-columns: 1fr 1fr; }
.option-card { background: #fff; border-radius: 16px; padding: 16px; border: 2px solid #e5e7eb; border-bottom-width: 4px; cursor: pointer; transition: all .15s ease; display: flex; align-items: center; justify-content: center; min-height: 60px; position: relative; user-select: none; -webkit-tap-highlight-color: transparent; animation: optIn .25s ease backwards; }
.option-card:hover { border-color: #d1d5db; }
.option-card:active { transform: translateY(2px); border-bottom-width: 2px; }
.option-card.selected { border-color: #84cc16; background: #f7fee7; color: #4d7c0f; }
.option-card.playing { border-color: #60a5fa; background: #eff6ff; color: #1d4ed8; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
.option-card.correct { border-color: #84cc16; background: #d9f99d; color: #365314; }
.option-card.wrong { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
.option-card.locked { cursor: default; transform: none; }
.option-card.has-image-layout { flex-direction: column; align-items: stretch; justify-content: flex-start; padding: 12px; }
.option-text { font-weight: 700; text-align: center; line-height: 1.35; font-size: 1.1rem;}
.option-play-dot { position: absolute; top: 8px; right: 10px; font-size: 14px; opacity: .85; }
.submit-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); border-top: 2px solid #f3f4f6; background: #fff; display: flex; justify-content: space-between; align-items: center; z-index: 50; }
.submit-btn { flex: 1; background: #58cc02; color: white; padding: 16px; border-radius: 16px; font-size: 1.2rem; font-weight: 800; text-transform: uppercase; border: none; border-bottom: 4px solid #46a302; transition: all 0.1s; -webkit-tap-highlight-color: transparent; cursor: pointer;}
.submit-btn:active { transform: translateY(4px); border-bottom-width: 0; margin-bottom: 4px; }
.submit-btn:disabled { background: #e5e7eb; color: #9ca3af; border-bottom-color: #d1d5db; cursor: not-allowed; transform: none; margin-bottom: 0;}
.submit-btn.is-ready { background: #58cc02; }
.result-sheet { position: absolute; bottom: 0; left: 0; right: 0; background: #fff; padding: 20px 24px calc(24px + env(safe-area-inset-bottom)); border-top-left-radius: 24px; border-top-right-radius: 24px; transform: translateY(110%); transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 100; box-shadow: 0 -10px 40px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 16px; }
.result-sheet.correct { background: #dcfce7; color: #166534; }
.result-sheet.wrong { background: #fee2e2; color: #991b1b; }
.result-sheet.show { transform: translateY(0); }
.sheet-header { font-size: 1.6rem; font-weight: 900; margin-bottom: 4px; display: flex; align-items: center; gap: 12px; }
.next-btn { width: 100%; padding: 16px; border-radius: 16px; border: none; color: #fff; font-weight: 800; text-transform: uppercase; font-size: 1.2rem; cursor: pointer; border-bottom: 4px solid rgba(0,0,0,0.2); -webkit-tap-highlight-color: transparent; display: flex; align-items: center; justify-content: center; gap: 8px;}
.next-btn:active { transform: translateY(4px); border-bottom-width: 0; margin-bottom: 4px;}
.btn-correct { background: #58cc02; border-bottom-color: #46a302; }
.btn-wrong { background: #ef4444; border-bottom-color: #b91c1c; }
.ai-btn { background: #fff; border: 2px solid #e5e7eb; color: #4f46e5; padding: 14px; border-radius: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 4px; -webkit-tap-highlight-color: transparent; font-size: 1.1rem;}
.ai-btn:disabled { opacity: .65; cursor: default; }
.ai-error { font-size: .95rem; color: #b91c1c; font-weight: 700; text-align: center;}
.options-grid.shake { animation: shakeX .4s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes optIn { from { opacity: 0; transform: translateY(10px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes shakeX { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-6px); } 40%, 60% { transform: translateX(6px); } }
`;

// =================================================================================
// 4) 辅助工具
// =================================================================================
const playSfx = (type) => {
  const paths = {
    click: '/sounds/click.mp3',
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/incorrect.mp3'
  };
  if (!paths[type]) return;
  const audio = new Audio(paths[type]);
  audio.play().catch(() => {});
};

const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// =================================================================================
// 5) 主组件
// =================================================================================
const XuanZeTi = ({ data: rawData, onCorrect, onWrong, onNext, triggerAI }) => {
  const data = rawData?.content || rawData || {};
  const question = data.question || {};
  const questionText = typeof question === 'string' ? question : question.text || '';
  const questionImg = data.imageUrl || '';
  const options = data.options || [];

  // 格式化正确答案数组
  const correctAnswers = useMemo(() => {
    const raw = data.correctAnswer || [];
    return (Array.isArray(raw) ? raw : [raw]).map(String);
  }, [data.correctAnswer]);

  const hasOptionImages = useMemo(() => options.some((opt) => opt.img || opt.imageUrl), [options]);

  // 随机打乱选项顺序
  const shuffledOptions = useMemo(() => {
    const opts = [...options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [data?.id, options]);

  // 提前计算正确答案的中文/缅文组合（修复截断的地方）
  const correctTextJoined = useMemo(() => {
    return options
      .filter((o) => correctAnswers.includes(String(o.id)))
      .map((o) => o.text)
      .join(' / ');
  }, [options, correctAnswers]);

  // 状态管理
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [speakingOptionId, setSpeakingOptionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeOptions, setShakeOptions] = useState(false);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const nextLockRef = useRef(false);
  const timersRef = useRef([]);

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // 初始化与清理
  useEffect(() => {
    nextLockRef.current = false;
    clearTimers();
    audioController.stop();

    setSelectedIds([]);
    setIsSubmitted(false);
    setIsRight(false);
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);
    setIsSubmitting(false);
    setShakeOptions(false);
    setShowResultSheet(false);
    setCanContinue(false);
    setAiLoading(false);
    setAiError('');

    // 自动播放题目
    if (questionText) {
      addTimer(() => {
        audioController.playMixed(
          questionText,
          {},
          () => { setSpeakingOptionId(null); setIsQuestionPlaying(true); },
          () => setIsQuestionPlaying(false)
        );
      }, 500);
    }

    return () => {
      clearTimers();
      audioController.stop(); // 组件卸载时必须终止音频
    };
  }, [data?.id, questionText]);

  // 选项点击逻辑
  const toggleOption = (id) => {
    if (isSubmitted || isSubmitting) return;

    playSfx('click');
    vibrate(15);

    const sid = String(id);

    // 单选 vs 多选 逻辑
    if (correctAnswers.length === 1) {
      setSelectedIds([sid]);
    } else {
      setSelectedIds((prev) => prev.includes(sid) ? prev.filter((i) => i !== sid) : [...prev, sid]);
    }

    // 播放选项音频
    const opt = options.find((o) => String(o.id) === sid);
    if (opt?.text) {
      setIsQuestionPlaying(false);
      setSpeakingOptionId(sid);
      audioController.playMixed(opt.text, {}, undefined, () => setSpeakingOptionId(null));
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (!selectedIds.length || isSubmitting || isSubmitted) return;

    setIsSubmitting(true);
    setCanContinue(false);
    setAiError('');

    const correct = selectedIds.length === correctAnswers.length && selectedIds.every((id) => correctAnswers.includes(id));
    setIsRight(correct);
    setIsSubmitted(true);

    audioController.stop();
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);

    if (correct) {
      playSfx('correct');
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      onCorrect?.();
    } else {
      playSfx('wrong');
      vibrate([50, 50, 50]);
      setShakeOptions(true);
      addTimer(() => setShakeOptions(false), 400);
      onWrong?.();
    }

    addTimer(() => setShowResultSheet(true), 100);
    addTimer(() => setCanContinue(true), 600); // 防误触延迟
    addTimer(() => setIsSubmitting(false), 200);
  };

  const handleContinue = () => {
    if (!canContinue || nextLockRef.current) return;
    nextLockRef.current = true;
    audioController.stop();
    onNext?.();
  };

  const handleAskAI = async (e) => {
    e.stopPropagation();
    if (!triggerAI || aiLoading) return;

    setAiLoading(true);
    setAiError('');

    try {
      const userSelectedText = options.filter((o) => selectedIds.includes(String(o.id))).map((o) => o.text).join(', ');
      await Promise.resolve(
        triggerAI({
          grammarPoint: data.grammarPoint || '通用语法',
          question: questionText,
          userChoice: userSelectedText || '未选择',
          correctAnswer: correctTextJoined || '未知',
          timestamp: Date.now()
        })
      );
    } catch (err) {
      console.warn('[AI] triggerAI failed:', err);
      setAiError('AI 老师暂时开小差了，请稍后再试。');
    } finally {
      setAiLoading(false);
    }
  };

  // 富文本渲染：分离汉字与拼音
  const renderRichText = (text) => {
    if (!text) return null;
    const parts = text.match(/([\u4e00-\u9fa5]+|[^\u4e00-\u9fa5]+)/g) || [];

    return parts.map((part, i) => {
      if (/[\u4e00-\u9fa5]/.test(part)) {
        const py = pinyin(part, { type: 'array', toneType: 'symbol' });
        return part.split('').map((char, j) => (
          <div key={`${i}-${j}`} className="zh-seg">
            <span className="zh-py">{py[j] || ''}</span>
            <span className="zh-char">{char}</span>
          </div>
        ));
      }
      return <span key={i} className="my-seg">{part}</span>;
    });
  };

  return (
    <div className="xzt-container">
      {/* 注入 CSS */}
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      {/* 头部：包含老师形象和气泡 */}
      <div className="xzt-header">
        <div className="scene-wrapper">
          <img src="/images/laoshi.png" className="teacher-img" alt="Teacher" onError={(e) => e.target.style.display='none'} />

          <div className="bubble-container">
            <div className="bubble-tail" />
            <div className="flex-1">
              {questionImg && !questionText ? (
                <div className="text-gray-500 italic text-sm font-bold">请看下图选择对应项</div>
              ) : (
                <div className="flex flex-wrap items-end gap-1">
                  {renderRichText(questionText)}
                </div>
              )}
            </div>

            {questionText && (
                <div
                className={`p-3 rounded-xl cursor-pointer transition-colors flex-shrink-0 ${
                    isQuestionPlaying ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setSpeakingOptionId(null);
                    audioController.playMixed(questionText, {}, () => setIsQuestionPlaying(true), () => setIsQuestionPlaying(false));
                }}
                >
                {isQuestionPlaying ? <FaSpinner className="animate-spin" size={20} /> : <FaVolumeUp size={20} />}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* 图片题：展示大图 */}
      {questionImg && (
        <div className="w-full flex justify-center mt-2 mb-2 px-4">
          <img src={questionImg} alt="Topic" className="rounded-2xl max-h-40 object-contain shadow-md border border-gray-100" />
        </div>
      )}

      {/* 选项区 */}
      <div className="xzt-scroll-area">
        <div className={`options-grid ${hasOptionImages ? 'has-images' : ''} ${shakeOptions ? 'shake' : ''}`}>
          {shuffledOptions.map((opt, index) => {
            const sid = String(opt.id);
            const isSel = selectedIds.includes(sid);
            const isCorrect = correctAnswers.includes(sid);
            const optImg = opt.img || opt.imageUrl;
            const isPlayingThis = speakingOptionId === sid && !isSubmitted;

            let cls = 'option-card';
            if (optImg) cls += ' has-image-layout';
            if (isSubmitted) {
              cls += ' locked';
              if (isCorrect) cls += ' correct';
              else if (isSel) cls += ' wrong';
            } else {
              if (isPlayingThis) cls += ' playing';
              else if (isSel) cls += ' selected';
            }

            return (
              <div key={sid} className={cls} onClick={() => toggleOption(sid)} style={{ animationDelay: `${index * 0.05}s` }}>
                {isPlayingThis && (
                  <div className="option-play-dot text-blue-500">
                    <FaSpinner className="animate-spin" />
                  </div>
                )}
                {optImg && <img src={optImg} alt="option" className="h-28 w-full object-cover rounded-xl mb-3 shadow-sm" />}
                <span className="option-text">{opt.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部提交按钮 (未提交时显示) */}
      {!isSubmitted && (
        <div className="submit-bar">
          <button className="submit-btn" disabled={!selectedIds.length || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'CHECKING...' : 'စစ်ဆေးမည် (CHECK)'}
          </button>
        </div>
      )}

      {/* 结果底部弹窗 */}
      <div className={`result-sheet ${showResultSheet ? 'show' : ''} ${isRight ? 'correct' : 'wrong'}`}>
        <div className="sheet-header">
          {isRight ? <FaCheck className="text-3xl" /> : <FaTimes className="text-3xl" />}
          <span>{isRight ? 'မှန်ပါတယ်!' : 'မှားနေပါတယ်'}</span>
        </div>

        {!isRight && (
          <div className="mb-2 text-lg font-bold opacity-90">
            အဖြေမှန်: {correctTextJoined || '-'}
          </div>
        )}

        {/* AI 解析按钮 */}
        {!isRight && triggerAI && (
          <>
            <button className="ai-btn" onClick={handleAskAI} disabled={aiLoading}>
              {aiLoading ? <FaSpinner className="animate-spin" size={20} /> : <FaRobot size={20} />}
              <span>{aiLoading ? 'AI ရှင်းလင်းချက် ရယူနေသည်...' : 'AI ရှင်းလင်းချက်'}</span>
            </button>
            {!!aiError && <div className="ai-error">{aiError}</div>}
          </>
        )}

        <button className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`} onClick={handleContinue} disabled={!canContinue}>
          ဆက်သွားမည် <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default XuanZeTi;

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
import InteractiveAIExplanationPanel from '../ai/InteractiveAIExplanationPanel'; // 【关键】引入你写好的全屏AI组件

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
// 2. 音效与杂项
// =================================================================================
function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
}

function playBeep(type = 'tap') {
  if (typeof window === 'undefined') return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    let frequency = 520, duration = 0.06, volume = 0.03;
    if (type === 'correct') { frequency = 760; duration = 0.1; volume = 0.045; }
    else if (type === 'wrong') { frequency = 220; duration = 0.12; volume = 0.05; }
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => { try { ctx.close(); } catch (_) {} };
  } catch (_) {}
}

const TTS_VOICES = { zh: 'zh-CN-XiaoxiaoMultilingualNeural', my: 'my-MM-ThihaNeural', en: 'en-US-JennyNeural' };
const RATE_MAP = { slow: -30, normal: 0, fast: 20 };

const PREFS_STORAGE_KEY = 'quiz_choice_prefs_v2';
const AI_STORAGE_KEY = 'interactive_ai_settings_v2';

const DEFAULT_PREFS = { showQuestionPinyin: true, showOptionPinyin: true, autoPlay: true, rateMode: 'normal' };
const DEFAULT_AI_SETTINGS = {
  apiUrl: '', apiKey: '', model: 'mistral-large-2512', temperature: 0.2,
  systemPrompt: '你是一位互动题解析老师。请根据题目、选项、学生答案和正确答案，用简洁中文解释为什么对或错。不要输出 Markdown。',
  ttsApiUrl: 'https://t.leftsite.cn/tts', zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural', myVoice: 'my-MM-ThihaNeural',
  ttsSpeed: -10, ttsPitch: 0, soundFx: true, vibration: true
};

function getSavedPrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try { return JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY)) || DEFAULT_PREFS; } catch { return DEFAULT_PREFS; }
}

function getSavedAISettings() {
  if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS;
  try { return JSON.parse(localStorage.getItem(AI_STORAGE_KEY)) || DEFAULT_AI_SETTINGS; } catch { return DEFAULT_AI_SETTINGS; }
}

const containsChinese = (text = '') => /[\u4e00-\u9fff]/.test(text);

// 文本与拼音渲染
const renderTextWithOptionalPinyin = (text, showPy, charClass, pyClass) => {
  if (!text) return null;
  return Array.from(text).map((ch, i) => {
    if (containsChinese(ch)) {
      const py = pinyin(ch, { toneType: 'symbol' });
      return (
        <span key={i} className="zh-seg">
          {showPy && <span className={pyClass}>{py}</span>}
          <span className={charClass}>{ch}</span>
        </span>
      );
    }
    return <span key={i} className="my-seg">{ch}</span>;
  });
};

// =================================================================================
// 3. TTS 播放引擎
// =================================================================================
const audioController = {
  currentAudio: null,
  stop() {
    if (this.currentAudio) {
      try { this.currentAudio.pause(); this.currentAudio.currentTime = 0; } catch (_) {}
      this.currentAudio = null;
    }
  },
  async playMixed(text, { rate = 0, aiSettings = null } = {}, onStart, onEnd) {
    this.stop();
    if (!text) return onEnd?.();
    onStart?.();
    try {
      const url = `${aiSettings?.ttsApiUrl || 'https://t.leftsite.cn/tts'}?t=${encodeURIComponent(text)}&v=${TTS_VOICES.zh}&r=${rate}`;
      const audio = new Audio(url);
      this.currentAudio = audio;
      audio.onended = () => onEnd?.();
      audio.onerror = () => onEnd?.();
      await audio.play();
    } catch (e) {
      onEnd?.();
    }
  }
};

// =================================================================================
// 4. CSS 样式 (修复乱码版)
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

.bubble-container { flex:1; background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%); border-radius:30px; padding:20px 16px; border:3px solid #bfdbfe; position:relative; display:flex; align-items:center; justify-content:space-between; gap:14px; box-shadow:0 12px 28px rgba(37,99,235,0.10), 0 3px 0 rgba(59,130,246,0.08); min-height:96px; }
.bubble-tail { position:absolute; bottom:24px; left:-12px; width:0; height:0; border-top:10px solid transparent; border-bottom:10px solid transparent; border-right:12px solid #bfdbfe; }
.bubble-tail::after { content:''; position:absolute; top:-8px; left:3px; border-top:8px solid transparent; border-bottom:8px solid transparent; border-right:10px solid #ffffff; }

.zh-seg { display:inline-flex; flex-direction:column; align-items:center; margin:0 1px; }
.zh-py { font-size:.7rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:3px; }
.zh-char { font-size:1.52rem; font-weight:900; color:#1e293b; line-height:1.16; }
.my-seg { font-size:1.08rem; font-weight:700; color:#334155; white-space:pre-wrap; }
.bubble-play-btn { flex-shrink:0; width:52px; height:52px; border-radius:9999px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:inset 0 -2px 0 rgba(0,0,0,0.06), 0 6px 12px rgba(37,99,235,0.14); }

.question-image { width:100%; max-width:310px; align-self:center; border-radius:22px; border:3px solid #f1f5f9; background:#fff; box-shadow:0 8px 20px rgba(15,23,42,0.06); object-fit:cover; }

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
.option-py { font-size:.68rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:4px; }
.option-text { font-size:1.15rem; font-weight:700; text-align:center; }

.submit-bar { position:absolute; bottom:0; left:0; right:0; padding:16px 16px calc(16px + env(safe-area-inset-bottom)); background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%); display:flex; justify-content:center; }
.submit-btn { width:100%; max-width:400px; padding:16px; border-radius:18px; font-size:1.15rem; font-weight:900; background:#58cc02; color:#fff; border:none; border-bottom:4px solid #46a302; cursor:pointer; transition:all .1s; box-shadow:0 4px 12px rgba(88,204,2,0.25); }
.submit-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:0 2px 0 #46a302; }
.submit-btn:disabled { background:#e5e5e5; color:#9ca3af; border-bottom-color:#d1d5db; box-shadow:none; cursor:not-allowed; }

.result-sheet { position:absolute; bottom:0; left:0; right:0; padding:20px 16px calc(20px + env(safe-area-inset-bottom)); border-top-left-radius:24px; border-top-right-radius:24px; display:flex; flex-direction:column; gap:12px; transform:translateY(100%); transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow:0 -10px 30px rgba(0,0,0,0.08); z-index:100; }
.result-sheet.show { transform:translateY(0); }
.result-sheet.correct { background:#d7ffb8; border-top:3px solid #a3e635; }
.result-sheet.wrong { background:#ffdfe0; border-top:3px solid #fca5a5; }

.sheet-header { display:flex; align-items:center; gap:8px; font-size:1.35rem; font-weight:900; }
.result-sheet.correct .sheet-header { color:#58cc02; }
.result-sheet.wrong .sheet-header { color:#ef4444; }
.sheet-sub { font-size:0.95rem; font-weight:700; color:#64748b; margin-bottom:8px; }

.ai-btn { background:#fff; padding:12px; border-radius:14px; font-weight:900; color:#8b5cf6; border:2px solid #ddd6fe; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-shadow:0 4px 0 #ddd6fe; margin-bottom:8px; }
.ai-btn:active { transform:translateY(4px); box-shadow:none; }

.next-btn { width:100%; padding:16px; border-radius:18px; font-size:1.15rem; font-weight:900; color:#fff; border:none; border-bottom:4px solid; cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px; transition:all .1s; }
.btn-correct { background:#58cc02; border-bottom-color:#46a302; box-shadow:0 4px 12px rgba(88,204,2,0.25); }
.btn-wrong { background:#ef4444; border-bottom-color:#dc2626; box-shadow:0 4px 12px rgba(239,68,68,0.25); }
.next-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:none; }
`;

// =================================================================================
// 5. 设置面板组件 (修复乱码)
// =================================================================================
function SettingsPanel({ prefs, setPrefs, aiSettings, updateAISettings, onClose }) {
  return (
    <div className="absolute top-10 right-0 z-[120] w-72 bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-4 text-sm text-slate-700">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <span className="font-bold">题目设置</span>
        <button onClick={onClose}><FaTimes className="text-slate-400" /></button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span>显示题目拼音</span>
        <input type="checkbox" checked={prefs.showQuestionPinyin} onChange={e => setPrefs({...prefs, showQuestionPinyin: e.target.checked})} />
      </div>
      <div className="flex justify-between items-center mb-3">
        <span>显示选项拼音</span>
        <input type="checkbox" checked={prefs.showOptionPinyin} onChange={e => setPrefs({...prefs, showOptionPinyin: e.target.checked})} />
      </div>
      
      <div className="mt-4 mb-2 font-bold text-xs text-slate-400 uppercase">AI 设置</div>
      <input 
        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 mb-2 text-xs"
        placeholder="API URL (例: https://api.openai.com/v1)"
        value={aiSettings.apiUrl} onChange={e => updateAISettings({apiUrl: e.target.value})}
      />
      <input 
        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 mb-2 text-xs"
        placeholder="API Key (Bearer ...)"
        type="password"
        value={aiSettings.apiKey} onChange={e => updateAISettings({apiKey: e.target.value})}
      />
      <div className="text-xs text-slate-500 mt-2">提示：配置完成后，答错时可使用AI讲解。</div>
    </div>
  );
}

// =================================================================================
// 6. 主题组件
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

  const hasOptionImages = useMemo(() => options.some((opt) => opt.img || opt.imageUrl), [options]);

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

  const [prefs, setPrefs] = useState(() => getSavedPrefs());
  const [aiSettings, setAISettings] = useState(() => getSavedAISettings());
  
  // 新 AI 面板状态
  const [showAIExplanation, setShowAIExplanation] = useState(false);
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
    if (typeof window !== 'undefined') localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => { setQuestionImgVisible(Boolean(questionImg)); }, [questionImg]);

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

    return () => { clearTimers(); audioController.stop(); };
  }, [data?.id, questionText, prefs.autoPlay, currentRate]);

  const updateAISettings = (patch) => setAISettings((prev) => ({ ...prev, ...patch }));

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
    if (aiSettings.vibration) vibrate(15);
    if (aiSettings.soundFx) playBeep('tap');
    
    const sid = String(id);
    if (correctAnswers.length === 1) setSelectedIds([sid]);
    else setSelectedIds((prev) => prev.includes(sid) ? prev.filter((i) => i !== sid) : [...prev, sid]);

    setCardPopId(sid);
    setTimeout(() => { if (mountedRef.current) setCardPopId((prev) => (prev === sid ? null : prev)); }, 180);

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
    const correct = selectedIds.length === correctAnswers.length && selectedIds.every((id) => correctAnswers.includes(id));
    
    setIsRight(correct);
    setIsSubmitted(true);
    audioController.stop();
    setIsQuestionPlaying(false);
    setSpeakingOptionId(null);

    if (correct) {
      if (aiSettings.vibration) vibrate([30, 40, 30]);
      if (aiSettings.soundFx) playBeep('correct');
      onCorrect?.();
    } else {
      if (aiSettings.vibration) vibrate([40, 40, 40]);
      if (aiSettings.soundFx) playBeep('wrong');
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
    // 打开面板，具体抓取题目逻辑交由 InteractiveAIExplanationPanel 的 initialPayload 处理
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
            <SettingsPanel prefs={prefs} setPrefs={setPrefs} aiSettings={aiSettings} updateAISettings={updateAISettings} onClose={() => setShowSettings(false)} />
          )}

          <div className="scene-wrapper">
            <img src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/1765952194374.png" className="teacher-img" alt="Teacher" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className="question-zone">
              <div className="bubble-container">
                <div className="bubble-tail" />
                <div className="flex-1 flex flex-wrap items-end gap-1">
                  {renderTextWithOptionalPinyin(questionText, prefs.showQuestionPinyin, 'zh-char', 'zh-py')}
                </div>
                {questionText && (
                  <div
                    className="bubble-play-btn"
                    style={{ background: isQuestionPlaying ? '#2563eb' : '#eff6ff', color: isQuestionPlaying ? '#fff' : '#2563eb' }}
                    onClick={playQuestion}
                  >
                    {isQuestionPlaying ? <FaSpinner className="animate-spin" size={20} /> : <FaVolumeUp size={20} />}
                  </div>
                )}
              </div>
              {questionImg && questionImgVisible ? (
                <img src={questionImg} alt="question" className="question-image" onError={() => setQuestionImgVisible(false)} />
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
                {speakingOptionId === sid && <FaSpinner className="absolute top-3 right-3 text-blue-500 animate-spin" />}
                {(opt.img || opt.imageUrl) && (
                  <img src={opt.img || opt.imageUrl} alt="opt" className="h-24 w-full object-cover rounded-xl mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
                <div className="option-text-wrap">
                  {showPy ? (
                    <div className="option-py">
                      {pinyin(String(opt.text).replace(/[^\u4e00-\u9fff]/g, ''), { toneType: 'symbol' })}
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
          <button className="submit-btn" disabled={!selectedIds.length} onClick={handleSubmit}>检查答案</button>
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

        {/* 触发AI讲解的按钮 */}
        {!isRight && (
          <button className="ai-btn" onClick={handleAI}>
            <FaRobot /> AI 语音讲题老师
          </button>
        )}

        <button
          className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`}
          onClick={() => { audioController.stop(); onNext?.(); }}
        >
          继续 <FaArrowRight />
        </button>
      </div>

      {/* 挂载新的全屏 AI 组件 */}
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

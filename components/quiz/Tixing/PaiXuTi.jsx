import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRedo,
  FaRobot,
  FaCog
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import InteractiveAIExplanationPanel from '../../ai/InteractiveAIExplanationPanel';
import {
  getSavedInteractivePrefs,
  getSavedInteractiveAISettings,
  saveInteractivePrefs,
  saveInteractiveAISettings,
  speedLabelToPlayback
} from '../../interactiveQuiz/interactiveSettings';

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
    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(blob, key);
    } catch (_) {}
  }
};

function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function playSfx(type) {
  const paths = {
    click: '/sounds/click.mp3',
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/incorrect.mp3',
    switch: '/sounds/switch-card.mp3'
  };
  const path = paths[type];
  if (!path || typeof window === 'undefined') return;

  try {
    const audio = new Audio(path);
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch (_) {}
}

const TTS_VOICES = {
  zh: 'zh-CN-XiaoxiaoMultilingualNeural',
  my: 'my-MM-ThihaNeural',
  en: 'en-US-JennyNeural'
};

const isChineseChar = (ch = '') => /[\u4e00-\u9fff]/.test(ch);
const isMyanmarChar = (ch = '') => /[\u1000-\u109F]/.test(ch);
const isLatinOrDigit = (ch = '') => /[a-zA-Z0-9]/.test(ch);
const isWhitespace = (ch = '') => /\s/.test(ch);
const isPunctuationOrSymbol = (ch = '') =>
  !isChineseChar(ch) && !isMyanmarChar(ch) && !isLatinOrDigit(ch) && !isWhitespace(ch);

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
  if (wholeType !== 'mixed') return [{ text: text.trim(), lang: wholeType || 'zh' }];

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
    else if (isWhitespace(ch) || isPunctuationOrSymbol(ch)) {
      currentText += ch;
      continue;
    }

    if (!currentLang) {
      currentLang = lang;
      currentText += ch;
      continue;
    }

    if (lang === currentLang) currentText += ch;
    else {
      pushCurrent();
      currentLang = lang;
      currentText = ch;
    }
  }

  pushCurrent();

  if (!segments.length && text.trim()) return [{ text: text.trim(), lang: 'zh' }];
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

  async playMixed(text, { speed = 1.0, aiSettings = null } = {}, onStart, onEnd) {
    this.stop();

    const raw = String(text || '').trim();
    if (!raw) {
      onEnd?.();
      return;
    }

    const reqId = this.latestRequestId;
    onStart?.();

    try {
      const rateValue = speed === 0.75 ? -25 : speed >= 1.1 ? 18 : 0;
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
          rateValue,
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
  },

  async playSingle(text, { speed = 1.0, aiSettings = null } = {}, onStart, onEnd) {
    return this.playMixed(text, { speed, aiSettings }, onStart, onEnd);
  }
};

const styles = `
.pxt-container {
  font-family: "Padauk", "Noto Sans SC", sans-serif;
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
}
.pxt-container.ai-open .result-sheet,
.pxt-container.ai-open .footer-bar {
  visibility: hidden;
  pointer-events: none;
}

.pxt-header {
  flex-shrink: 0;
  padding: 10px 16px 4px;
  display: flex;
  justify-content: center;
}
.top-row {
  width: 100%;
  max-width: 640px;
}
.top-hint-row {
  width: 100%;
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
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.teacher-img {
  height: 180px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  margin-left: -6px;
}
.bubble-box {
  flex: 1;
  background: #fff;
  border-radius: 20px 20px 20px 4px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  margin-bottom: 20px;
}
.bubble-tail {
  position: absolute;
  bottom: 15px; left: -11px;
  width: 0; height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 12px solid #e2e8f0;
}
.bubble-tail::after {
  content: '';
  position: absolute;
  top: -7px; left: 3px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 9px solid #fff;
}
.question-img-small {
  width: 60px; height: 60px;
  object-fit: cover; border-radius: 8px;
  margin-right: 10px; float: left;
  border: 1px solid #f1f5f9;
}

.pxt-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 16px 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort-area {
  width: 100%;
  max-width: 640px;
  min-height: 120px;
  background: #fff;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 12px;
  display: flex; flex-wrap: wrap; gap: 8px;
  align-content: flex-start;
  margin-bottom: 24px;
  transition: all 0.25s ease;
}
.sort-area.active { border-color: #3b82f6; background: #eff6ff; border-style: solid; }
.sort-area.error { border-color: #fca5a5; background: #fef2f2; border-style: solid; }
.sort-area.success { border-color: #86efac; background: #f0fdf4; border-style: solid; }

.pool-area {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.word-card {
  touch-action: none;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-bottom: 3px solid #e2e8f0;
  border-radius: 12px;
  padding: 6px 14px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: grab;
  transition: all 0.1s;
  min-width: 50px;
}
.word-card:active {
  transform: translateY(2px);
  border-bottom-width: 1px;
  margin-top: 2px;
}
.word-card.in-pool { background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
.word-card.dragging { opacity: 0.3; }
.word-card.overlay {
  transform: scale(1.1) rotate(2deg);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 999;
  border-color: #3b82f6;
  background: #fff;
}
.pinyin-sub {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 0px;
  line-height: 1.2;
}

.footer-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px 16px calc(22px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%);
  display: flex; justify-content: center;
  z-index: 50;
}
.check-btn {
  width: 100%; max-width: 640px;
  background: #58cc02; color: white;
  padding: 15px; border-radius: 16px;
  font-size: 1.1rem; font-weight: 800;
  box-shadow: 0 4px 0 #46a302;
  border: none;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.1s;
}
.check-btn:active { transform: translateY(4px); box-shadow: none; }
.check-btn:disabled { background: #e5e7eb; color: #9ca3af; box-shadow: none; transform: none; }

.result-sheet {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 24px 20px calc(28px + env(safe-area-inset-bottom));
  box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
  transform: translateY(110%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
  max-height: 85vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 12px;
}
.result-sheet.correct { background: #dcfce7; color: #166534; }
.result-sheet.wrong { background: #fee2e2; color: #991b1b; }
.result-sheet.open { transform: translateY(0); }

.sheet-header {
  display: flex; align-items: center; gap: 10px;
  font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;
}
.correct-answer-box {
  background: #fff; padding: 14px; border-radius: 12px;
  margin-bottom: 8px; color: #475569; font-size: 1.1rem; font-weight: 600;
  border: 1px solid rgba(0,0,0,0.05);
}
.sheet-sub {
  font-size: 0.95rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
}
.next-action-btn {
  width: 100%; padding: 15px; border-radius: 16px; border: none;
  font-size: 1.1rem; font-weight: 800;
  color: white; cursor: pointer;
  border-bottom: 4px solid rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.next-action-btn:active { transform: translateY(4px); border-bottom-width: 0; }
.btn-correct { background: #58cc02; }
.btn-wrong { background: #ef4444; }

.ai-btn {
  background: #fff;
  border: 2px solid #e5e7eb;
  color: #4f46e5;
  padding: 12px;
  border-radius: 14px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: all 0.1s;
}
.ai-btn:active { background: #f9fafb; transform: scale(0.98); }

.modal-backdrop {
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.35);
  backdrop-filter:blur(4px);
}
.panel-modal {
  position:fixed;
  inset:0;
  z-index:1200;
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
  border-radius:24px;
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
.setting-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 2px; }
.setting-label { font-size:13px; font-weight:900; color:#334155; }
.switch { width:42px; height:24px; border-radius:9999px; position:relative; transition:all .2s; cursor:pointer; }
.switch-dot { position:absolute; top:3px; width:16px; height:16px; border-radius:9999px; background:#fff; transition:all .2s; box-shadow:0 1px 4px rgba(0,0,0,.15); }
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
`;

function CardContent({ text, showPinyin = true }) {
  const safeText = String(text || '');
  const isPunc = /^[。，、？！；：“”‘’（）《》〈〉【】 .,!?;:"'()\[\]{}]+$/.test(safeText);
  let py = '';

  if (showPinyin && !isPunc) {
    try {
      py = pinyin(safeText, { toneType: 'mark' });
    } catch (_) {
      py = '';
    }
  }

  return (
    <>
      {py ? <div className="pinyin-sub">{py}</div> : null}
      <div>{safeText}</div>
    </>
  );
}

function SortableItem({ id, content, isPool, onClick, isOverlay, showPinyin = true }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  if (isOverlay) {
    return (
      <div className="word-card overlay">
        <CardContent text={content} showPinyin={showPinyin} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`word-card ${isDragging ? 'dragging' : ''} ${isPool ? 'in-pool' : ''}`}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <CardContent text={content} showPinyin={showPinyin} />
    </div>
  );
}

function SettingsPanel({ prefs, setPrefs, onClose }) {
  return (
    <div className="panel-modal" style={{ zIndex: 1200 }}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="panel-card relative">
        <div className="panel-header">
          <span className="panel-title">学习设置</span>
          <button className="panel-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="settings-section-title" style={{ marginTop: 0 }}>
          显示与朗读
        </div>

        <div className="setting-row">
          <span className="setting-label">显示拼音</span>
          <div
            className="switch"
            onClick={() => setPrefs((s) => ({ ...s, showPinyin: !s.showPinyin }))}
            style={{ background: prefs.showPinyin ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.showPinyin ? '22px' : '4px' }} />
          </div>
        </div>

        <div className="setting-row">
          <span className="setting-label">自动朗读题干</span>
          <div
            className="switch"
            onClick={() => setPrefs((s) => ({ ...s, autoPlay: !s.autoPlay }))}
            style={{ background: prefs.autoPlay ? '#58cc02' : '#cbd5e1' }}
          >
            <div className="switch-dot" style={{ left: prefs.autoPlay ? '22px' : '4px' }} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="setting-label" style={{ marginBottom: 8 }}>
            朗读速度
          </div>
          <div className="select-grid-2">
            {[
              { key: 'slow', label: '慢速' },
              { key: 'normal', label: '正常' },
              { key: 'fast', label: '快速' }
            ].map((item) => (
              <button
                key={item.key}
                className={`small-choice-btn ${prefs.ttsSpeed === item.key ? 'active' : ''}`}
                onClick={() => setPrefs((s) => ({ ...s, ttsSpeed: item.key }))}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function isOrderedResult(status) {
  return status === 'success' || status === 'error';
}

export default function PaiXuTi({
  data: rawData,
  onCorrect,
  onNext,
  onWrong,
  onOverlayChange
}) {
  const data = rawData?.content || rawData || {};
  const { title = '', items = [], correctOrder = [], imageUrl = '' } = data;

  const [poolIds, setPoolIds] = useState([]);
  const [answerIds, setAnswerIds] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [gameStatus, setGameStatus] = useState('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  const [prefs, setPrefs] = useState(() => getSavedInteractivePrefs());
  const [aiSettings, setAISettings] = useState(() => getSavedInteractiveAISettings());

  const mountedRef = useRef(true);
  const overlayStackRef = useRef([]);

  const hasOverlayOpen = showAIExplanation || showSettings;

  useEffect(() => {
    onOverlayChange?.(hasOverlayOpen);
    return () => {
      onOverlayChange?.(false);
    };
  }, [hasOverlayOpen, onOverlayChange]);

  const findItem = useCallback(
    (id) => items.find((i) => String(i.id) === String(id)),
    [items]
  );

  const shuffledAllIds = useMemo(() => {
    const ids = items.map((i) => String(i.id));
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [items]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      overlayStackRef.current = [];
      audioController.stop();
    };
  }, []);

  useEffect(() => {
    saveInteractivePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    saveInteractiveAISettings(aiSettings);
  }, [aiSettings]);

  const closeOverlayByType = useCallback((type) => {
    if (type === 'ai-explanation') setShowAIExplanation(false);
    if (type === 'settings') setShowSettings(false);
  }, []);

  const closeTopOverlay = useCallback(() => {
    const top = overlayStackRef.current[overlayStackRef.current.length - 1];
    if (!top) return false;
    closeOverlayByType(top);
    return true;
  }, [closeOverlayByType]);

  const openOverlay = useCallback((type, setter) => {
    if (typeof window === 'undefined') {
      setter(true);
      return;
    }

    const alreadyTop = overlayStackRef.current[overlayStackRef.current.length - 1] === type;
    setter(true);

    if (!alreadyTop) {
      overlayStackRef.current.push(type);
      window.history.pushState({ __sortOverlay: type }, '');
    }
  }, []);

  const syncOverlayStack = useCallback((type, visible) => {
    if (visible) return;
    overlayStackRef.current = overlayStackRef.current.filter((t) => t !== type);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      closeTopOverlay();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [closeTopOverlay]);

  useEffect(() => {
    syncOverlayStack('settings', showSettings);
  }, [showSettings, syncOverlayStack]);

  useEffect(() => {
    syncOverlayStack('ai-explanation', showAIExplanation);
  }, [showAIExplanation, syncOverlayStack]);

  const playbackSpeed = speedLabelToPlayback(prefs.ttsSpeed);

  useEffect(() => {
    setPoolIds(shuffledAllIds);
    setAnswerIds([]);
    setActiveId(null);
    setGameStatus('idle');
    setShowSettings(false);
    setShowAIExplanation(false);
    overlayStackRef.current = [];
    audioController.stop();

    let timer;
    if (title && prefs.autoPlay) {
      timer = setTimeout(() => {
        audioController.playMixed(
          title,
          { speed: playbackSpeed, aiSettings },
          () => mountedRef.current && setIsPlaying(true),
          () => mountedRef.current && setIsPlaying(false)
        );
      }, 400);
    }

    return () => {
      if (timer) clearTimeout(timer);
      audioController.stop();
    };
  }, [title, shuffledAllIds, prefs.autoPlay, playbackSpeed]);

  const updateAISettings = (patch) => {
    setAISettings((prev) => ({ ...prev, ...patch }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePlayQuestion = () => {
    audioController.playMixed(
      title,
      { speed: playbackSpeed, aiSettings },
      () => mountedRef.current && setIsPlaying(true),
      () => mountedRef.current && setIsPlaying(false)
    );
  };

  const handleCardClick = (id) => {
    if (gameStatus === 'success') return;

    if (aiSettings.soundFx) playSfx('click');
    if (aiSettings.vibration) vibrate(15);

    const sid = String(id);
    const item = findItem(sid);

    if (item?.text) {
      audioController.playSingle(item.text, { speed: playbackSpeed, aiSettings });
    }

    if (answerIds.includes(sid)) {
      setAnswerIds((prev) => prev.filter((i) => i !== sid));
      setPoolIds((prev) => [...prev, sid]);
    } else {
      setPoolIds((prev) => prev.filter((i) => i !== sid));
      setAnswerIds((prev) => [...prev, sid]);
      if (gameStatus === 'error') setGameStatus('idle');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setAnswerIds((current) => {
        const oldIndex = current.indexOf(String(active.id));
        const newIndex = current.indexOf(String(over.id));
        return arrayMove(current, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    if (aiSettings.vibration) vibrate(15);
  };

  const handleCheck = () => {
    if (!answerIds.length) return;

    if (aiSettings.soundFx) playSfx('click');

    const currentStr = answerIds.join(',');
    const correctStr = (correctOrder || []).map(String).join(',');
    const isCorrect = currentStr === correctStr;

    setTimeout(() => {
      if (isCorrect) {
        setGameStatus('success');
        if (aiSettings.soundFx) playSfx('correct');
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.65 } });

        const fullSentence = correctOrder
          .map((id) => findItem(String(id))?.text || '')
          .join('');

        audioController.playSingle(fullSentence, { speed: playbackSpeed, aiSettings });
      } else {
        setGameStatus('error');
        if (aiSettings.soundFx) playSfx('wrong');
        if (aiSettings.vibration) vibrate([50, 50, 50]);
      }
    }, 150);
  };

  const handleContinue = () => {
    if (aiSettings.soundFx) playSfx('switch');
    audioController.stop();

    if (gameStatus === 'success') onCorrect?.();
    else onWrong?.();
  };

  const handleOpenSettings = () => {
    if (showAIExplanation) return;
    openOverlay('settings', setShowSettings);
  };

  const handleAskAI = () => {
    audioController.stop();
    setIsPlaying(false);
    setShowSettings(false);
    openOverlay('ai-explanation', setShowAIExplanation);
  };

  const activeItem = activeId ? findItem(activeId) : null;

  const userSentence = answerIds.map((id) => findItem(id)?.text || '').join('');
  const correctSentence = (correctOrder || []).map((id) => findItem(String(id))?.text || '').join('');
  const allWordsText = items.map((i) => i.text).join(' / ');

  return (
    <div className={`pxt-container ${hasOverlayOpen ? 'ai-open' : ''}`}>
      <style>{styles}</style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          setActiveId(String(active.id));
          if (aiSettings.vibration) vibrate(10);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="pxt-header">
          <div className="top-row">
            <div className="top-hint-row">
              <div className="top-left-text">请把词语排成正确顺序</div>
              <div className="top-actions">
                <button className="settings-btn" onClick={handleOpenSettings}>
                  <FaCog size={18} />
                </button>
              </div>
            </div>

            <div className="scene-wrapper">
              <img
                src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/1765952194374.png"
                className="teacher-img"
                alt="Teacher"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              <div className="bubble-box">
                <div className="bubble-tail" />

                <div className="flex items-start gap-2">
                  {imageUrl ? <img src={imageUrl} className="question-img-small" alt="Context" /> : null}

                  <span className="text-lg font-semibold text-slate-700 leading-snug flex-1 pt-1">
                    {title || 'Put the words in the correct order.'}
                  </span>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      className={`p-2 rounded-full ${isPlaying ? 'text-blue-600' : 'text-slate-400'} bg-slate-50`}
                      onClick={handlePlayQuestion}
                    >
                      {isPlaying ? <FaSpinner className="animate-spin" /> : <FaVolumeUp />}
                    </button>

                    <button
                      onClick={() =>
                        setPrefs((s) => ({
                          ...s,
                          ttsSpeed:
                            s.ttsSpeed === 'normal'
                              ? 'slow'
                              : s.ttsSpeed === 'slow'
                              ? 'fast'
                              : 'normal'
                        }))
                      }
                      className="p-2 rounded-full text-slate-400 bg-slate-50 text-xs font-bold flex items-center justify-center border border-slate-200"
                    >
                      {prefs.ttsSpeed === 'slow' ? '0.75x' : prefs.ttsSpeed === 'fast' ? '1.15x' : '1.0x'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pxt-scroll-body">
          <div className={`sort-area ${gameStatus}`}>
            <SortableContext items={answerIds} strategy={rectSortingStrategy}>
              {answerIds.map((id) => (
                <SortableItem
                  key={id}
                  id={id}
                  content={findItem(id)?.text}
                  onClick={() => handleCardClick(id)}
                  showPinyin={prefs.showPinyin}
                />
              ))}
            </SortableContext>

            {answerIds.length === 0 && !activeId ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
                点击下方词卡开始排序
              </div>
            ) : null}
          </div>

          <div className="pool-area">
            {poolIds.map((id) => (
              <div key={id} onClick={() => handleCardClick(id)}>
                <div className="word-card in-pool">
                  <CardContent text={findItem(id)?.text} showPinyin={prefs.showPinyin} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: '0.5' } }
            })
          }}
        >
          {activeItem ? (
            <SortableItem
              id={activeId}
              content={activeItem.text}
              isOverlay
              showPinyin={prefs.showPinyin}
            />
          ) : null}
        </DragOverlay>

        {!isOrderedResult(gameStatus) && !showAIExplanation ? (
          <div className="footer-bar">
            <button className="check-btn" onClick={handleCheck} disabled={answerIds.length === 0}>
              检查答案
            </button>
          </div>
        ) : null}

        <div
          className={`result-sheet ${isOrderedResult(gameStatus) && !showAIExplanation ? 'open' : ''} ${
            gameStatus === 'success' ? 'correct' : 'wrong'
          }`}
        >
          {gameStatus === 'success' ? (
            <>
              <div className="sheet-header">
                <FaCheck /> 太棒了！
              </div>

              <div className="sheet-sub">你已经排出了正确顺序。</div>

              <button className="next-action-btn btn-correct" onClick={handleContinue}>
                继续 <FaArrowRight />
              </button>
            </>
          ) : null}

          {gameStatus === 'error' ? (
            <>
              <div className="sheet-header">
                <FaTimes /> 再试试看
              </div>

              <div className="sheet-sub">你已经很接近正确答案了。</div>

              <div className="mb-2 text-sm font-bold opacity-80">正确答案：</div>
              <div className="correct-answer-box">{correctSentence}</div>

              <button className="ai-btn" onClick={handleAskAI}>
                <FaRobot size={18} />
                <span>AI 语音讲题老师</span>
              </button>

              <button className="next-action-btn btn-wrong" onClick={handleContinue}>
                知道了 <FaRedo style={{ fontSize: '0.9em' }} />
              </button>
            </>
          ) : null}
        </div>
      </DndContext>

      {showSettings ? (
        <SettingsPanel
          prefs={prefs}
          setPrefs={setPrefs}
          onClose={() => setShowSettings(false)}
        />
      ) : null}

      <InteractiveAIExplanationPanel
        open={showAIExplanation}
        onClose={() => setShowAIExplanation(false)}
        settings={aiSettings}
        updateSettings={updateAISettings}
        title="AI 讲题老师"
        initialPayload={{
          questionType: 'sorting',
          grammarPoint: '连词成句 / 排序题',
          questionText: title || '请把词语排成正确顺序',
          questionImage: imageUrl || '',
          options: items.map((i) => ({ id: String(i.id), text: i.text })),
          selectedIds: answerIds.map(String),
          correctAnswers: (correctOrder || []).map(String),
          isRight: gameStatus === 'success',
          extraContext: {
            allWords: allWordsText,
            userSentence,
            correctSentence,
            rawType: 'sorting'
          }
        }}
      />
    </div>
  );
}

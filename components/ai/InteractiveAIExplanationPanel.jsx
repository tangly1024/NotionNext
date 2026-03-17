'use client';

import React, { useState, useRef } from 'react';
import { FaMicrophone, FaKeyboard, FaPaperPlane, FaStop, FaClosedCaptioning, FaCommentSlash } from 'react-icons/fa';

export function BottomControlBarEnhanced({
  isAIReady,
  textMode,
  setTextMode,
  isRecording,
  isThinking,
  isAiSpeaking,
  inputText,
  setInputText,
  sendMessage,
  stopEverything,
  handleMicPointerDown,
  handleMicPointerUp,
  handleMicPointerCancel,
  showText,
  setShowText,
  currentLangObj
}) {
  const LANGUAGES = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'my', name: 'မြန်မာစာ', flag: '🇲🇲' }
  ];

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLangObj || LANGUAGES[0]);
  const longPressTimer = useRef(null);

  const handleMicDown = (e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setShowLangMenu(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 350);
    handleMicPointerDown(e, selectedLang.code);
  };

  const handleMicUp = (e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    handleMicPointerUp(e);
  };

  const handleMicCancel = (e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    handleMicPointerCancel(e);
  };

  const selectLang = (e, lang) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLang(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] pt-3">
      <div className="glass-panel mx-auto w-full max-w-3xl rounded-[28px] px-4 py-3 flex items-center gap-3">
        {/* 模式切换按钮 */}
        <button
          onClick={() => setTextMode(!textMode)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all active:scale-95 ${
            textMode
              ? 'border-pink-400/30 bg-pink-400/15 text-pink-200 hover:bg-pink-400/20'
              : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
          }`}
          title={textMode ? '切换语音输入' : '切换文字输入'}
        >
          {textMode ? <FaMicrophone size={17} /> : <FaKeyboard size={17} />}
        </button>

        {/* 核心按钮 */}
        <div className="flex-1 flex justify-center relative">
          <button
            type="button"
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            onPointerCancel={handleMicCancel}
            onPointerLeave={handleMicCancel}
            onContextMenu={(e) => e.preventDefault()}
            className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 shadow-md ${
              isRecording
                ? 'animate-pulse-ring bg-pink-500'
                : 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-[0_14px_35px_rgba(236,72,153,.28)] hover:scale-105 active:scale-95'
            }`}
          >
            {isRecording ? <FaPaperPlane className="animate-pulse text-3xl" /> : <FaMicrophone className="text-3xl" />}
          </button>

          <div className="mt-3 min-h-[18px] text-center text-[10px] font-bold tracking-[0.18em] text-slate-400">
            {isRecording
              ? <span className="text-pink-300">点击发送 · 静默自动发送</span>
              : isThinking
              ? <span className="text-violet-300">思考中...</span>
              : isAiSpeaking
              ? <div className="tts-bars flex gap-1"><span /><span /><span /><span /><span /></div>
              : `长按切换语言 · ${selectedLang.flag} ${selectedLang.name}`}
          </div>

          {/* 长按语言选择菜单 */}
          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-50"
                onPointerDown={() => setShowLangMenu(false)}
              />
              <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-50 w-[260px] max-h-[300px] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg p-2 grid grid-cols-2 gap-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onPointerDown={(e) => selectLang(e, lang)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition ${
                      selectedLang.code === lang.code
                        ? 'bg-blue-50 border border-blue-200 text-blue-600'
                        : 'hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 字幕按钮 */}
        <button
          onClick={() => setShowText(!showText)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
            showText
              ? 'border-pink-400/30 bg-pink-400/15 text-pink-200 hover:bg-pink-400/20'
              : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
          }`}
          title={showText ? '隐藏字幕' : '显示字幕'}
        >
          {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
        </button>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaArrowLeft, FaVolumeUp } from 'react-icons/fa';
import { AI_SCENES, buildExerciseBootstrapPrompt } from './aiAssistants';
import { normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';
import { BottomControlBarEnhanced } from './BottomControlBarEnhanced';

// ==========================
// 全局样式：滚动条 / 拼音 / 头像呼吸
// ==========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .font-pinyin { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; }
    .font-burmese { font-family: 'Padauk','Myanmar Text',sans-serif; line-height:2.6 !important; }
    .tts-bars span { display:inline-block;width:4px;height:20px;border-radius:999px;background:linear-gradient(180deg,#fb7185,#f472b6);margin:0 2px;transform-origin:bottom;animation:bars 0.55s ease-in-out infinite;}
    .tts-bars span:nth-child(2){animation-delay:.06s;}
    .tts-bars span:nth-child(3){animation-delay:.12s;}
    .tts-bars span:nth-child(4){animation-delay:.18s;}
    .tts-bars span:nth-child(5){animation-delay:.24s;}

    @keyframes bars {0%,100%{transform:scaleY(.35);opacity:.45;}50%{transform:scaleY(1);opacity:1;}}
    @keyframes avatar-breathe {0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(236,72,153,0.3);}50%{transform:scale(1.06);box-shadow:0 0 25px 8px rgba(236,72,153,0.5);}}
    .animate-avatar-breathe {animation:avatar-breathe 2s ease-in-out infinite;}
  `}</style>
);

// ==========================
// AI头像动画区
// ==========================
function AIAvatarCenter({ isSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-24">
      <div className="relative flex items-center justify-center">
        {isSpeaking && <>
          <div className="absolute inset-0 rounded-full border-[2px] border-pink-400/60 animate-ping"/>
          <div className="absolute inset-0 rounded-full border-[2px] border-pink-400/40 animate-ping delay-200"/>
        </>}
        <div className={`relative z-10 h-36 w-36 rounded-full overflow-hidden border-[3px] bg-white shadow-md transition-all duration-300 ${isSpeaking ? 'animate-avatar-breathe border-pink-400' : 'border-slate-200/80'}`}>
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
            alt="AI Teacher"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="mt-8 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-center min-w-[180px]">
        {isSpeaking ? <span className="text-sm font-bold tracking-widest text-slate-500">正在讲解中...</span>
        : isThinking ? <span className="text-sm font-bold tracking-widest text-blue-500 animate-pulse">思考中...</span>
        : isRecording ? <span className="text-sm font-bold tracking-widest text-pink-500 animate-pulse">正在倾听...</span>
        : <span className="text-[13px] font-bold tracking-widest text-slate-400">期待你的提问</span>}
      </div>
    </div>
  );
}

// ==========================
// 聊天列表：行距 & 拼音优化
// ==========================
function ChatList({ history=[], isRecording, inputText='', replaySpecificAnswer }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {history.map(msg => {
          if(msg.role==='error') return (
            <div key={msg.id} className="p-3 rounded-2xl border border-red-400/20 bg-red-500/10 text-red-200 font-bold text-sm">
              ⚠️ {msg.text}
            </div>
          );
          if(msg.role==='user') return (
            <div key={msg.id} className="flex justify-end">
              <div className="user-bubble bg-gradient-to-tr from-pink-500 to-purple-600 px-5 py-3 rounded-[22px] text-white text-[15px] leading-7 font-medium whitespace-pre-wrap max-w-[85%]">
                {msg.text}
              </div>
            </div>
          );
          const aiText = normalizeAssistantText(msg.text||'');
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 assistant-bubble inline-block rounded-[22px] rounded-tl-md px-5 py-4 text-slate-100 text-[15px] leading-7 font-medium whitespace-pre-wrap">
                {aiText || '思考中...'}
                {msg.isStreaming && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-pink-400 align-middle" />}
                {!msg.isStreaming && aiText && (
                  <button onClick={()=>replaySpecificAnswer(msg.text)} className="ml-3 mt-1 inline-flex items-center text-slate-400 hover:text-pink-300 active:scale-90" title="朗读">
                    <FaVolumeUp size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isRecording && inputText && (
          <div className="flex justify-end">
            <div className="user-bubble bg-gradient-to-tr from-pink-500 to-purple-600 px-5 py-3 rounded-[22px] text-white text-[15px] leading-7 font-medium whitespace-pre-wrap max-w-[85%] animate-pulse">
              {inputText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================
// 主组件
// ==========================
export default function InteractiveAIExplanationPanel({
  open,
  title = 'AI 讲题老师',
  initialPayload = null,
  onClose,
  settings,
  updateSettings
}) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(AI_SCENES.EXERCISE);
  const effectiveSettings = settings || resolvedSettings;

  const fallbackUpdateSettings = useCallback(
    (patch={})=>{
      const sharedPatch={}, scenePatch={};
      Object.entries(patch).forEach(([k,v])=>{
        if(SHARED_KEYS.includes(k)) sharedPatch[k]=v;
        if(SCENE_KEYS.includes(k)) scenePatch[k]=v;
      });
      if(Object.keys(sharedPatch).length) updateSharedSettings(sharedPatch);
      if(Object.keys(scenePatch).length) updateSceneSettings(AI_SCENES.EXERCISE,scenePatch);
    },
    [updateSharedSettings, updateSceneSettings]
  );
  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(()=>Boolean(
    effectiveSettings?.apiKey &&
    effectiveSettings?.apiUrl &&
    effectiveSettings?.model
  ),[effectiveSettings]);

  const sessionOpen = open && isAIReady;

  const {
    history,
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    isRecording,
    currentLangObj,
    scrollRef,
    sendMessage,
    stopEverything,
    recLang,
    setRecLang,
    showLangPicker,
    setShowLangPicker,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    showText,
    setShowText,
    replaySpecificAnswer
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: true
  });

  useEffect(()=>setMounted(true),[]);
  useEffect(()=>{ if(open && !isAIReady) setShowSettings(true); }, [open, isAIReady]);
  useEffect(()=>{
    if(!open) return;
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{ document.body.style.overflow=prev; };
  },[open]);

  if(!mounted || !open) return null;

  return createPortal(
    <>
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 z-[2147483001] flex flex-col h-[100dvh] text-white">
        {isAIReady && showText
          ? <ChatList history={history} isRecording={isRecording} inputText={inputText} replaySpecificAnswer={replaySpecificAnswer} />
          : <AIAvatarCenter isSpeaking={isAiSpeaking} isRecording={isRecording} isThinking={isThinking} />
        }

        <BottomControlBarEnhanced
          isAIReady={isAIReady}
          textMode={textMode}
          setTextMode={setTextMode}
          isRecording={isRecording}
          isThinking={isThinking}
          isAiSpeaking={isAiSpeaking}
          inputText={inputText}
          setInputText={setInputText}
          sendMessage={sendMessage}
          stopEverything={stopEverything}
          handleMicPointerDown={handleMicPointerDown}
          handleMicPointerUp={handleMicPointerUp}
          handleMicPointerCancel={handleMicPointerCancel}
          showText={showText}
          setShowText={setShowText}
          currentLangObj={currentLangObj}
        />

        <RecognitionLanguagePicker
          open={showLangPicker}
          recLang={recLang}
          setRecLang={setRecLang}
          onClose={()=>setShowLangPicker(false)}
          theme="light"
        />
        <AISettingsModal
          open={showSettings}
          settings={effectiveSettings}
          updateSettings={effectiveUpdateSettings}
          onClose={()=>setShowSettings(false)}
          scene="exercise"
        />
      </div>
    </>,
    document.body
  );
    }

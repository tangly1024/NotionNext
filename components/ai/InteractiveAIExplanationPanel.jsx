'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaArrowLeft, FaPaperPlane, FaMicrophone, FaStop, FaKeyboard, FaClosedCaptioning } from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import { AI_SCENES, buildExerciseBootstrapPrompt } from './aiAssistants';
import { normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .no-select { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .can-select { -webkit-user-select: text; user-select: text; }
    @keyframes pulse-ring { 0% { transform: scale(0.95); box-shadow:0 0 0 0 rgba(236,72,153,0.5);}70%{transform:scale(1.05);box-shadow:0 0 0 25px rgba(236,72,153,0);}100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(236,72,153,0);}}
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }
    @keyframes ripple-out {0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; }}
    .animate-ripple-1 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite; }
    .animate-ripple-2 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite 1s; }
  `}</style>
);

const SHARED_KEYS = ['providerId','apiUrl','apiKey','model','ttsApiUrl','ttsVoice','zhVoice','myVoice','ttsSpeed','ttsPitch','soundFx','vibration'];
const SCENE_KEYS = ['assistantId','systemPrompt','temperature','showText','asrSilenceMs'];

// ======================================
// 拼音组件
// ======================================
const PinyinText = React.memo(({ text='', showPinyin=false, isStreaming=false }) => {
  const tokens = useMemo(()=>{
    if(!text) return [];
    const pyArray = pinyin(text,{type:'array',toneType:'symbol',nonZh:'removed'});
    let pyIndex=0,currentNonZh='';
    const chars = Array.from(text);
    const result = [];
    for(let i=0;i<chars.length;i++){
      const char = chars[i];
      const isZh = /[\u4e00-\u9fa5]/.test(char);
      if(isZh){
        if(currentNonZh){result.push({text:currentNonZh,isZh:false}); currentNonZh='';}
        result.push({text:char,isZh:true,py:pyArray[pyIndex++]||''});
      } else currentNonZh+=char;
    }
    if(currentNonZh) result.push({text:currentNonZh,isZh:false});
    return result;
  },[text]);
  return (
    <div className="flex flex-wrap items-end text-[17px] text-slate-800 font-medium leading-[1.8] tracking-wide gap-y-3">
      {tokens.map((t,idx)=>(
        <div key={`${idx}-${t.text}`} className={`flex flex-col items-center justify-end ${t.isZh?'mx-[1.5px]':''}`}>
          {showPinyin && t.isZh && (
            <span className="text-[10px] leading-none text-blue-400 mb-[3px] font-light tracking-tight">{t.py}</span>
          )}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {isStreaming && <span className="ml-1 mt-1 inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />}
    </div>
  );
});

// ======================================
// 顶部导航
// ======================================
function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="flex-none flex h-[60px] items-center justify-between px-4 bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/50 z-20">
      <button onClick={onBack} className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 active:scale-90 transition-transform">
        <FaArrowLeft size={18}/>
      </button>
      <div className="text-[15px] font-black tracking-widest text-slate-800">{title}</div>
      <button onClick={onOpenSettings} className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
        <FaPaperPlane size={18}/>
      </button>
    </div>
  );
}

// ======================================
// AI头像
// ======================================
function AIAvatarCenter({ isSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-20">
      <div className="relative flex items-center justify-center">
        {isSpeaking && <>
          <div className="absolute inset-0 rounded-full border-[1.5px] border-pink-400/60 animate-ripple-1"/>
          <div className="absolute inset-0 rounded-full border-[1.5px] border-pink-400/40 animate-ripple-2"/>
        </>}
        <div className="relative z-10 h-[80px] w-[80px] rounded-full overflow-hidden border-[1.5px] border-slate-200/80 bg-white shadow-md">
          <img src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg" alt="AI Teacher" loading="lazy" onError={e=>{e.currentTarget.src='https://api.dicebear.com/7.x/bottts/svg?seed=fallback';}} className="h-full w-full object-cover rounded-full"/>
        </div>
      </div>
      <div className="mt-8 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm">
        {isSpeaking?<span className="text-sm font-bold tracking-widest text-slate-500">正在讲解中...</span>
        : isThinking?<span className="text-sm font-bold tracking-widest text-blue-500 animate-pulse">思考中...</span>
        : isRecording?<span className="text-sm font-bold tracking-widest text-pink-500 animate-pulse">正在倾听...</span>
        : <span className="text-[13px] font-bold tracking-widest text-slate-400">期待你的提问</span>}
      </div>
    </div>
  );
}

// ======================================
// 聊天区
// ======================================
function ChatList({ history=[], isRecording, textMode, inputText='', replaySpecificAnswer, scrollRef }) {
  const [pinyinMap,setPinyinMap]=useState({});
  const togglePinyin=(id)=>setPinyinMap(prev=>({...prev,[id]:!prev[id]}));
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar scroll-smooth">
      <div className="mx-auto flex w-full max-w-2xl flex-col pb-8">
        {history.map(msg=>{
          if(msg.role==='error') return <div key={msg.id} className="mb-6 text-left text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">⚠️ {msg.text}</div>;
          if(msg.role==='user') return <div key={msg.id} className="mb-8 w-full text-left pl-2"><div className="text-[15px] font-medium leading-[1.8] text-slate-400 tracking-wide">{msg.text}</div></div>;
          const aiText = normalizeAssistantText(msg.text||'');
          const showPinyin = pinyinMap[msg.id];
          return (
            <div key={msg.id} className="mb-14 w-full flex flex-col items-start">
              <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming}/>
              {!msg.isStreaming && aiText && <div className="flex items-center gap-5 mt-4 pl-1">
                <button onClick={()=>replaySpecificAnswer(msg.text)} className="text-slate-300 hover:text-pink-500 transition-colors p-1" title="朗读"><FaMicrophone size={20}/></button>
                <button onClick={()=>togglePinyin(msg.id)} className={`text-[12px] font-black px-2.5 py-1 rounded-md transition-colors ${showPinyin?'bg-slate-200 text-slate-600':'bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-pink-400 hover:border-pink-200'}`} title="拼音">拼</button>
              </div>}
            </div>
          );
        })}
        {isRecording && textMode===false && inputText && <div className="mb-6 w-full text-left pl-2"><div className="text-[15px] font-medium text-pink-400 animate-pulse tracking-wide leading-relaxed">{inputText}</div></div>}
      </div>
    </div>
  );
}

// ======================================
// 底部控件
// ======================================
function BottomControlBar({ textMode, setTextMode, inputText, setInputText, sendMessage, isRecording, isAiSpeaking, isThinking, stopEverything, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel, showText, setShowText }) {
  const LANGUAGES=[
    {code:'zh',label:'中文(普通话)',flag:'🇨🇳'},
    {code:'my',label:'缅文',flag:'🇲🇲'},
    {code:'en',label:'English',flag:'🇺🇸'},
    {code:'th',label:'ไทย',flag:'🇹🇭'},
    {code:'ko',label:'한국어',flag:'🇰🇷'},
    {code:'ja',label:'日本語',flag:'🇯🇵'},
    {code:'vi',label:'Tiếng Việt',flag:'🇻🇳'},
    {code:'fr',label:'Français',flag:'🇫🇷'}
  ];
  const [showLangMenu,setShowLangMenu]=useState(false);
  const [currentLang,setCurrentLang]=useState(LANGUAGES[0]);
  const longPressTimer = useRef(null);

  const handleMicDown=(e)=>{
    longPressTimer.current = setTimeout(()=>setShowLangMenu(true),600);
    handleMicPointerDown(e,currentLang.code);
  };
  const handleMicUp=(e)=>{
    clearTimeout(longPressTimer.current);
    handleMicPointerUp(e);
  };
  const selectLang=(lang)=>{setCurrentLang(lang); setShowLangMenu(false);};

  return (
    <div className="flex-none bg-[#f8fafc] px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+12px)] z-30">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">
        {/* 左侧切换 */}
        <button onClick={()=>setTextMode(!textMode)} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 active:scale-95 transition">
          {textMode?<FaKeyboard size={20}/>:<FaMicrophone size={20}/>}
        </button>

        {/* 中间输入/语音 */}
        {textMode ? (
          <div className="flex-1 mx-3 h-12 flex items-center border border-slate-200 rounded-xl bg-white">
            <input type="text" value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="继续问老师..." className="flex-1 h-full px-4 text-slate-800 text-base outline-none bg-transparent" onKeyDown={e=>{if(e.key==='Enter'&&inputText.trim()){sendMessage(inputText); setInputText('');}}}/>
            <button onClick={()=>{if(inputText.trim()){sendMessage(inputText); setInputText('');}}} className="px-3 text-pink-500 hover:text-pink-600"><FaPaperPlane size={18}/></button>
          </div>
        ) : (
          <div className="flex-1 mx-3 flex justify-center relative">
            <button onPointerDown={handleMicDown} onPointerUp={handleMicUp} onPointerCancel={handleMicPointerCancel} onPointerLeave={handleMicPointerCancel} onContextMenu={e=>e.preventDefault()} className={`h-16 w-16 rounded-full text-white flex items-center justify-center transition-all ${isRecording?'bg-pink-500 scale-110 animate-pulse-ring':isAiSpeaking||isThinking?'bg-pink-300':'bg-pink-500'}`}>
              {isRecording?<FaStop size={24}/>:<FaMicrophone size={24}/>}
            </button>
            {isRecording && <div className="absolute -bottom-10 flex flex-wrap justify-center gap-2 text-xs text-pink-500 font-semibold animate-pulse"><span>{currentLang.flag}</span><span>{currentLang.label}</span></div>}
            {showLangMenu && <div className="absolute bottom-[80px] bg-white border border-slate-200 shadow-lg rounded-xl p-3 grid grid-cols-2 gap-2 w-64">
              {LANGUAGES.map(lang=>(
                <button key={lang.code} onClick={()=>selectLang(lang)} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition"><span>{lang.flag}</span><span className="text-sm">{lang.label}</span></button>
              ))}
            </div>}
          </div>
        )}

        {/* 右侧字幕 */}
        <button onClick={()=>setShowText(!showText)} className={`h-12 w-12 flex items-center justify-center rounded-xl border ${showText?'bg-pink-500 border-pink-500 text-white':'bg-white border-slate-200 text-slate-500'}`}>
          <FaClosedCaptioning size={16}/>
        </button>
      </div>
    </div>
  );
}

// ======================================
// ======================================
// 主组件
// ======================================
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
  const [localShowText, setLocalShowText] = useState(true);

  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(AI_SCENES.EXERCISE);
  const effectiveSettings = settings || resolvedSettings;

  const fallbackUpdateSettings = useCallback((patch = {}) => {
    const sharedPatch = {}, scenePatch = {};
    Object.entries(patch).forEach(([key, value]) => {
      if (SHARED_KEYS.includes(key)) sharedPatch[key] = value;
      if (SCENE_KEYS.includes(key)) scenePatch[key] = value;
    });
    if (Object.keys(sharedPatch).length) updateSharedSettings(sharedPatch);
    if (Object.keys(scenePatch).length) updateSceneSettings(AI_SCENES.EXERCISE, scenePatch);
  }, [updateSharedSettings, updateSceneSettings]);

  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(() => Boolean(
    effectiveSettings?.apiKey &&
    effectiveSettings?.apiUrl &&
    effectiveSettings?.model
  ), [effectiveSettings]);

  const sessionOpen = open && isAIReady;

  const {
    history = [],
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText = '',
    setInputText,
    isRecording,
    scrollRef,
    sendMessage,
    stopEverything,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    replaySpecificAnswer,
    showText,
    setShowText
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false
  });

  const actualShowText = showText ?? localShowText;
  const toggleShowText = val => { if (setShowText) setShowText(val); else setLocalShowText(val); };

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (open && !isAIReady) setShowSettings(true); }, [open, isAIReady]);

  // 禁止滚动穿透
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // 滚动到底部逻辑
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (nearBottom || isRecording) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [history, inputText, isRecording, scrollRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-slate-900/40 backdrop-blur-sm" />

      <div className="no-select fixed inset-0 z-[2147483001] flex flex-col bg-[#f8fafc] text-slate-800 font-sans h-[100dvh]">
        <HeaderBar
          title={title}
          onBack={() => { stopEverything(); onClose?.(); }}
          onOpenSettings={() => setShowSettings(true)}
        />

        {!isAIReady ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 pb-20">
            <span className="text-4xl mb-4">⚙️</span>
            <p className="text-sm font-bold">请点击右上角配置 AI 模型</p>
          </div>
        ) : actualShowText ? (
          <ChatList
            history={history}
            isRecording={isRecording}
            textMode={textMode}
            inputText={inputText}
            replaySpecificAnswer={replaySpecificAnswer}
            scrollRef={scrollRef}
          />
        ) : (
          <AIAvatarCenter
            isSpeaking={isAiSpeaking}
            isRecording={isRecording}
            isThinking={isThinking}
          />
        )}

        {isAIReady && (
          <BottomControlBar
            textMode={textMode}
            setTextMode={setTextMode}
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMessage}
            isRecording={isRecording}
            isAiSpeaking={isAiSpeaking}
            isThinking={isThinking}
            stopEverything={stopEverything}
            handleMicPointerDown={handleMicPointerDown}
            handleMicPointerUp={handleMicPointerUp}
            handleMicPointerCancel={handleMicPointerCancel}
            showText={actualShowText}
            setShowText={toggleShowText}
          />
        )}

        <RecognitionLanguagePicker open={false} recLang={null} setRecLang={() => {}} onClose={() => {}} theme="light" />
        <AISettingsModal open={showSettings} settings={effectiveSettings} updateSettings={effectiveUpdateSettings} onClose={() => setShowSettings(false)} scene="exercise" />
      </div>
    </>,
    document.body
  );
        }

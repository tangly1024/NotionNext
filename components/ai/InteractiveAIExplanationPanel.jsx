'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaArrowLeft, 
  FaBars, 
  FaPaperPlane, 
  FaMicrophone, 
  FaStop, 
  FaKeyboard, 
  FaClosedCaptioning,
  FaVolumeUp 
} from 'react-icons/fa';
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
    .touch-none { touch-action: none; }
    
    @keyframes pulse-ring { 
      0% { transform: scale(0.95); box-shadow:0 0 0 0 rgba(236,72,153,0.6);}
      70%{transform:scale(1.05);box-shadow:0 0 0 20px rgba(236,72,153,0);}
      100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(236,72,153,0);}
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }
    
    @keyframes ripple-out {
      0% { transform: scale(1); opacity: 0.6; } 
      100% { transform: scale(1.8); opacity: 0; }
    }
    .animate-ripple-1 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite; }
    .animate-ripple-2 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite 1s; }

    /* 头像 TTS 呼吸发光特效 */
    @keyframes avatar-breathe {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(236,72,153,0.3); }
      50% { transform: scale(1.06); box-shadow: 0 0 25px 8px rgba(236,72,153,0.5); border-color: rgba(244,114,182,1); }
    }
    .animate-avatar-breathe { animation: avatar-breathe 2s ease-in-out infinite; }
  `}</style>
);

const SHARED_KEYS =['providerId','apiUrl','apiKey','model','ttsApiUrl','ttsVoice','zhVoice','myVoice','ttsSpeed','ttsPitch','soundFx','vibration'];
const SCENE_KEYS =['assistantId','systemPrompt','temperature','showText','asrSilenceMs'];

// ======================================
// 拼音组件 (修复缅文行距，超大间距防重叠)
// ======================================
const PinyinText = React.memo(({ text='', showPinyin=false, isStreaming=false }) => {
  const tokens = useMemo(()=>{
    if(!text) return[];
    const pyArray = pinyin(text,{type:'array',toneType:'symbol',nonZh:'removed'});
    let pyIndex=0,currentNonZh='';
    const chars = Array.from(text);
    const result =[];
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
    // 使用 style={{ lineHeight: '3' }} 强制撑开高度，完美兼容缅文等带大量上下标的文字
    <div className="flex flex-wrap items-end text-[17px] text-slate-800 font-medium tracking-wide gap-y-7" style={{ lineHeight: '3' }}>
      {tokens.map((t,idx)=>(
        <div key={`${idx}-${t.text}`} className={`flex flex-col items-center justify-end ${t.isZh?'mx-[1.5px]':''}`}>
          {showPinyin && t.isZh && (
            <span 
              className="text-[12px] leading-none text-blue-500 mb-[4px] font-normal tracking-tight" 
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {t.py}
            </span>
          )}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {isStreaming && <span className="ml-2 mb-[10px] inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />}
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
      <button onClick={onOpenSettings} className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 active:scale-90 transition-transform">
        <FaBars size={18}/>
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
          <div className="absolute inset-0 rounded-full border-[2px] border-pink-400/60 animate-ripple-1"/>
          <div className="absolute inset-0 rounded-full border-[2px] border-pink-400/40 animate-ripple-2"/>
        </>}
        {/* 头像动效：讲话时加入呼吸缩放与发光特效 */}
        <div className={`relative z-10 h-[90px] w-[90px] rounded-full overflow-hidden border-[3px] bg-white shadow-md transition-all duration-300 ${isSpeaking ? 'animate-avatar-breathe border-pink-400' : 'border-slate-200/80'}`}>
          <img src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg" alt="AI Teacher" loading="lazy" onError={e=>{e.currentTarget.src='https://api.dicebear.com/7.x/bottts/svg?seed=fallback';}} className="h-full w-full object-cover rounded-full"/>
        </div>
      </div>
      <div className="mt-10 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm">
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
function ChatList({ history=[], isRecording, textMode, inputText='', isAiSpeaking, stopEverything, replaySpecificAnswer, scrollRef }) {
  const[pinyinMap,setPinyinMap]=useState({});
  const togglePinyin=(id)=>setPinyinMap(prev=>({...prev,[id]:!prev[id]}));

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar scroll-smooth">
      <div className="mx-auto flex w-full max-w-2xl flex-col pb-8">
        {history.map(msg=>{
          if(msg.role==='error') return <div key={msg.id} className="mb-6 text-left text-sm font-bold text-red-500 bg-red-50 p-3 rounded-2xl border border-red-100">⚠️ {msg.text}</div>;
          if(msg.role==='user') return <div key={msg.id} className="mb-8 w-full text-left pl-2"><div className="text-[15px] font-medium leading-[2.2] text-slate-400 tracking-wide">{msg.text}</div></div>;
          
          const aiText = normalizeAssistantText(msg.text||'');
          const showPinyin = pinyinMap[msg.id];
          
          return (
            <div key={msg.id} className="mb-14 w-full flex flex-col items-start">
              <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming}/>
              {!msg.isStreaming && aiText && (
                <div className="flex items-center gap-4 mt-4 pl-1">
                  <button 
                    onClick={() => isAiSpeaking ? stopEverything() : replaySpecificAnswer(msg.text)} 
                    className={`flex items-center justify-center h-9 w-9 rounded-full transition-all shadow-sm ${isAiSpeaking ? 'bg-pink-100 text-pink-500 border border-pink-200' : 'bg-white text-slate-400 border border-slate-200 hover:text-pink-500 hover:border-pink-200'}`} 
                    title={isAiSpeaking ? "停止播放" : "朗读"}
                  >
                    {isAiSpeaking ? <FaStop size={14}/> : <FaVolumeUp size={16}/>}
                  </button>
                  <button 
                    onClick={()=>togglePinyin(msg.id)} 
                    className={`text-[13px] font-black px-4 py-1.5 rounded-full transition-all ${showPinyin?'bg-slate-700 text-white shadow-md':'bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-pink-400 hover:border-pink-200'}`} 
                  >
                    拼音
                  </button>
                </div>
              )}
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
    {code:'zh',label:'中文',flag:'🇨🇳'},
    {code:'en',label:'English',flag:'🇺🇸'},
    {code:'ja',label:'日本語',flag:'🇯🇵'},
    {code:'ko',label:'한국어',flag:'🇰🇷'},
    {code:'th',label:'ไทย',flag:'🇹🇭'},
    {code:'vi',label:'Tiếng Việt',flag:'🇻🇳'},
    {code:'fr',label:'Français',flag:'🇫🇷'},
    {code:'es',label:'Español',flag:'🇪🇸'},
    {code:'ru',label:'Русский',flag:'🇷🇺'},
    {code:'my',label:'မြန်မာစာ',flag:'🇲🇲'}
  ];
  const[showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const longPressTimer = useRef(null);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setInputText(e.target.value);
    if(textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if(inputText.trim()){
      sendMessage(inputText); 
      setInputText('');
      if(textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  // 重写长按逻辑，降低延迟至 350ms，稳妥触发
  const handleMicDown=(e)=>{
    if(longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setShowLangMenu(true);
      if(typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
         window.navigator.vibrate(50); // 长按震动反馈
      }
    }, 350);
    handleMicPointerDown(e, currentLang.code);
  };
  
  const handleMicCancel=(e)=>{
    if(longPressTimer.current) clearTimeout(longPressTimer.current);
    handleMicPointerCancel(e);
  };

  const handleMicUp=(e)=>{
    if(longPressTimer.current) clearTimeout(longPressTimer.current);
    handleMicPointerUp(e);
  };

  const selectLang=(e, lang)=>{
    e.preventDefault();
    e.stopPropagation();
    setCurrentLang(lang); 
    setShowLangMenu(false);
  };

  return (
    <div className="flex-none bg-[#f8fafc] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] z-30">
      <div className="flex items-end justify-center gap-5 max-w-lg mx-auto relative">
        
        {/* 左侧模式切换 */}
        <button 
          onClick={()=>setTextMode(!textMode)} 
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 active:scale-95 transition shadow-sm mb-[2px]"
        >
          {textMode ? <FaMicrophone size={20}/> : <FaKeyboard size={20}/>}
        </button>

        {/* 中间核心区 */}
        <div className="flex-1 flex justify-center w-full max-w-[280px]">
          {textMode ? (
            // 四角带点圆的输入框 (rounded-2xl)
            <div className="w-full flex items-end border-[1.5px] border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden min-h-[48px] focus-within:border-pink-300 focus-within:shadow-md transition-all">
              <textarea 
                ref={textareaRef}
                value={inputText} 
                onChange={handleInput} 
                placeholder="继续问老师..." 
                className="flex-1 max-h-32 resize-none py-[13px] pl-4 pr-2 text-slate-800 text-[15px] outline-none bg-transparent no-scrollbar leading-snug" 
                rows={1}
                onKeyDown={e=>{
                  if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); }
                }}
              />
              <button onClick={handleSend} className="p-3 mb-[2px] text-pink-500 hover:text-pink-600">
                <FaPaperPlane size={18}/>
              </button>
            </div>
          ) : (
            <div className="relative flex justify-center pb-[2px]">
              {/* 超大麦克风按钮 h-20 w-20 (80px) */}
              <button 
                onPointerDown={handleMicDown} 
                onPointerUp={handleMicUp} 
                onPointerCancel={handleMicCancel} 
                onPointerLeave={handleMicCancel} 
                onContextMenu={e=>e.preventDefault()} 
                className={`touch-none h-20 w-20 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md ${isRecording ? 'bg-pink-500 scale-110 shadow-[0_4px_20px_rgba(236,72,153,0.5)] animate-pulse-ring' : isAiSpeaking||isThinking ? 'bg-pink-300' : 'bg-pink-500'}`}
              >
                {isRecording ? <FaStop size={30}/> : <FaMicrophone size={32}/>}
              </button>
              
              {isRecording && <div className="absolute -bottom-6 w-max flex justify-center gap-1.5 text-[12px] text-pink-500 font-bold animate-pulse"><span>{currentLang.flag}</span><span>{currentLang.label}</span></div>}
              
              {/* 长按语言选择菜单：层级和防打断 */}
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-[50]" onPointerDown={(e)=>{ e.stopPropagation(); setShowLangMenu(false); }}/>
                  <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-2xl p-2 w-[240px] max-h-[300px] overflow-y-auto z-[60] no-scrollbar">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 text-center text-xs text-slate-400 font-bold pb-2 pt-1 border-b border-slate-100 mb-1">
                      选择识别语言
                    </div>
                    <div className="grid grid-cols-1 gap-0.5">
                      {LANGUAGES.map(lang=>(
                        <button key={lang.code} onPointerDown={(e)=>selectLang(e, lang)} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition">
                          <span className="text-[15px] font-medium text-slate-700">{lang.label}</span>
                          <span className="text-xl">{lang.flag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 右侧字幕按钮：色彩区分 */}
        <button 
          onClick={()=>setShowText(!showText)} 
          className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-all shadow-sm mb-[2px] border ${showText ? 'bg-pink-50 border-pink-300 text-pink-500' : 'bg-white border-slate-200 text-slate-400'}`}
        >
          <FaClosedCaptioning size={22}/>
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
  const[localShowText, setLocalShowText] = useState(true);

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
  },[updateSharedSettings, updateSceneSettings]);

  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(() => Boolean(
    effectiveSettings?.apiKey &&
    effectiveSettings?.apiUrl &&
    effectiveSettings?.model
  ), [effectiveSettings]);

  const sessionOpen = open && isAIReady;

  const {
    history =[],
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

  useEffect(() => setMounted(true),[]);
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
            isAiSpeaking={isAiSpeaking}
            stopEverything={stopEverything}
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

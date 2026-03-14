'use client';

import React from 'react';
import { useVoiceChat } from './useVoiceChat';
import { RECOGNITION_LANGS, TTS_VOICES, toFinite } from './aiConfig';
import { DEFAULT_CHAT_PROMPT } from './aiPrompts'; // 修复了导入错误
import { mergeTranscript, normalizeAssistantText } from './aiTextUtils';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .app-container { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .selectable { -webkit-user-select: text; user-select: text; }
    @keyframes ping-slow { 75%, 100% { transform: scale(2); opacity: 0; } }
    .animate-ping-slow { animation: ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite; }
    @keyframes pulse-ring { 0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, .65); } 70% { transform: scale(1); box-shadow: 0 0 0 22px rgba(239, 68, 68, 0); } 100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    .animate-pulse-ring { animation: pulse-ring 1.3s infinite; }
    @keyframes bars { 0%,100% { transform: scaleY(.35); opacity:.45; } 50% { transform: scaleY(1); opacity:1; } }
    .tts-bars span { display:inline-block; width:4px; height:20px; border-radius:4px; background: linear-gradient(180deg,#f9a8d4,#a78bfa); margin:0 2px; transform-origin: bottom; animation: bars 0.55s ease-in-out infinite; }
    .tts-bars span:nth-child(2){ animation-delay:.06s; } .tts-bars span:nth-child(3){ animation-delay:.12s; } .tts-bars span:nth-child(4){ animation-delay:.18s; } .tts-bars span:nth-child(5){ animation-delay:.24s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

export default function VoiceChat({ isOpen, onClose }) {
  const {
    settings, setSettings, recLang, setRecLang, history,
    isRecording, isAiSpeaking, isThinking, textMode, setTextMode,
    inputText, setInputText, liveInterim, recordFinalText,
    showSettings, setShowSettings, showLangPicker, setShowLangPicker,
    scrollRef, sendMessage, stopEverything, clearRecordingBuffer,
    handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel
  } = useVoiceChat({ scene: 'free_talk' });

  if (!isOpen) return null;

  const liveText = mergeTranscript(recordFinalText, liveInterim);
  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];

  return (
    <div className="app-container fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />
      <div className="absolute inset-0 bg-cover bg-center opacity-68 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/48 to-slate-950/82 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.16),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.16),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button onClick={() => { stopEverything(); onClose?.(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"><i className="fas fa-arrow-left" /></button>
        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white"><i className="fas fa-sliders-h" /></button>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="selectable flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        {!settings.showText && !textMode ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56 pointer-events-none">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-violet-400/30 animate-ping-slow" style={{ animationDelay: '.4s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${isAiSpeaking ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,.6)]' : 'bg-white/10'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>
            <div className="mt-8 h-10 flex items-center justify-center">
              {isAiSpeaking ? <div className="tts-bars"><span /><span /><span /><span /><span /></div> : <span className="text-sm tracking-widest text-slate-300 font-medium">{isRecording ? '正在倾听...' : isThinking ? '思考中...' : '请说话'}</span>}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => {
              if (msg.role === 'error') return <div key={msg.id} className="mb-4 pl-12 text-red-200/85 text-sm">{msg.text}</div>;
              if (msg.role === 'user') return <div key={msg.id} className="mb-3 pl-12 text-[15px] leading-7 text-slate-200/55 whitespace-pre-wrap [text-shadow:0_1px_8px_rgba(0,0,0,.45)]">{msg.text}</div>;
              
              const aiText = normalizeAssistantText(msg.text || '');
              return (
                <div key={msg.id} className="mb-4 flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-full bg-pink-400/25 border border-pink-200/35 flex items-center justify-center text-lg shadow-[0_0_16px_rgba(236,72,153,.28)] shrink-0">👩</div>
                  <div className="flex-1 pt-0.5 text-[15px] leading-7 text-slate-100/92 whitespace-pre-wrap [text-shadow:0_1px_8px_rgba(0,0,0,.45)]">
                    {aiText || (msg.isStreaming ? '思考中...' : '')}
                    {msg.isStreaming && aiText && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-300 animate-pulse" />}
                  </div>
                </div>
              );
            })}
            {isRecording && (
              <div className="flex justify-start pl-12 mb-2">
                <div className="max-w-[92%] text-cyan-100/90 rounded-xl px-3 py-2 text-sm animate-[fadeIn_.2s_ease-out] bg-cyan-500/10 border border-cyan-300/25">
                  <span className="opacity-80 mr-2">识别中：</span><span>{liveText || '...'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/92 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 rounded-full bg-white/15 text-white active:scale-95 transition-transform"><i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} /></button>
          
          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4">
                {isRecording ? <button onClick={clearRecordingBuffer} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold animate-[fadeIn_.2s_ease-out]">清空</button> : <div className="w-14" />}
                <button
                  onPointerDown={handleMicPointerDown} onPointerUp={handleMicPointerUp} onPointerCancel={handleMicPointerCancel} onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse-ring scale-95' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'}`}
                >
                  <i className={`fas ${isRecording ? 'fa-paper-plane' : 'fa-microphone'} text-3xl ${isRecording ? 'animate-pulse' : ''}`} />
                </button>
                {isRecording ? <button onClick={stopEverything} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold animate-[fadeIn_.2s_ease-out]">取消</button> : <div className="w-14" />}
              </div>
              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase pointer-events-none">
                {isRecording ? <span className="text-red-400">点击发送 · 静默自动发送</span> : isThinking ? <span className="text-amber-300">思考中...</span> : `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-white/15 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input type="text" className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-300" placeholder="打字回复..." value={inputText} onFocus={stopEverything} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }} />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0"><i className="fas fa-paper-plane" /></button>
            </div>
          )}

          <div className="absolute right-0">
            {(isAiSpeaking || isRecording || isThinking) ? (
              <button onClick={stopEverything} className="w-12 h-12 rounded-full bg-white/15 text-white animate-[fadeIn_.2s_ease-out]"><i className="fas fa-stop" /></button>
            ) : (
              <button onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))} className={`w-12 h-12 rounded-full transition-colors ${settings.showText ? 'bg-pink-500/45 text-pink-100' : 'bg-white/15 text-white'}`}><i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} /></button>
            )}
          </div>
        </div>
      </div>

      {showLangPicker && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <h3 className="font-bold text-lg mb-4 text-center text-white">选择识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button key={lang.code} onClick={() => { setRecLang(lang.code); setShowLangPicker(false); }} className={`p-4 rounded-2xl border flex flex-col gap-2 transition-colors ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5 active:bg-white/10'}`}>
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-xs text-slate-300">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">⚙️ AI 设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/10 text-slate-300"><i className="fas fa-times" /></button>
            </div>
            <div className="selectable flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-slate-200 text-sm">
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-xs">API 配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="API URL" value={settings.apiUrl} onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} />
                <input type="password" autoComplete="off" className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none text-slate-200" placeholder="API Key" value={settings.apiKey} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} />
              </div>
              <div className="space-y-2">
                <div className="font-bold text-slate-400 text-xs flex justify-between"><span>系统提示词</span><button onClick={() => setSettings({ ...settings, systemPrompt: DEFAULT_CHAT_PROMPT })} className="text-pink-400">重置</button></div>
                <textarea rows={8} className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" value={settings.systemPrompt} onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

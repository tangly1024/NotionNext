import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  X, Cog, Volume2, Mic, Camera,
  ArrowUp, StopCircle, Languages, RotateCw, Sparkles, XCircle
} from 'lucide-react';

// ----------------- 1) 提示词 -----------------
const SYSTEM_PROMPTS = {
  faithful: `你是一位中缅双语翻译引擎。任务：将【源语言】翻译成【目标语言】。
【要求】忠实度最高，不得遗漏事实信息；保留称呼、语气；仅输出 JSON，禁止解释。
格式：{"data":[{"translation":"译文","back_translation":"回测"}]}`,
  natural: `你是一位精通中缅社交口语的 AI 翻译官。任务：将【源语言】自然地翻译为【目标语言】。
【要求】表达像当地人真实聊天；保留情绪与礼貌程度；仅输出 JSON，禁止解释。
格式：{"data":[{"translation":"译文","back_translation":"回测"}]}`
};

const DEFAULT_SETTINGS = {
  providers: [{ id: 'p1', name: '默认接口', url: 'https://apis.iflow.cn/v1', key: '' }],
  models: [{ id: 'm1', providerId: 'p1', name: 'DeepSeek V3', value: 'deepseek-chat' }],
  mainModelId: 'm1',
  autoPlayTTS: true,
  ttsSpeed: 1.1,
};

// ----------------- 2) 工具函数 -----------------
const safeStorageGet = (key) => {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeStorageSet = (key, value) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, value); } catch (e) {}
};
const parseJSON = (raw, fallback = null) => {
  try { return JSON.parse(raw); } catch { return fallback; }
};

const loadSettings = () => {
  const raw = safeStorageGet('ai886_settings');
  if (!raw) return DEFAULT_SETTINGS;
  const parsed = parseJSON(raw, null);
  if (!parsed || !Array.isArray(parsed.providers)) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...parsed };
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取失败'));
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > 1024) { height *= 1024 / width; width = 1024; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const detectScript = (text) => {
  if (!text) return null;
  if (/[\u1000-\u109F]+/.test(text)) return 'my-MM';
  if (/[\u4e00-\u9fa5]+/.test(text)) return 'zh-CN';
  return 'en-US';
};

// ----------------- 3) 子组件：翻译卡片 -----------------
const TranslationCard = memo(({ res, lang, onPlay }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(res.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { alert('复制失败，请手动长按复制'); }
  };

  return (
    <div className="relative bg-white shadow-sm border border-slate-100 rounded-2xl p-4 mb-3">
      <div className="text-center">
        <p className="text-[17px] font-bold text-slate-800 leading-relaxed mb-1.5 select-text">{res.translation}</p>
        {res.back_translation && <p className="text-[11px] text-slate-400 italic">意思：{res.back_translation}</p>}
      </div>
      <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-slate-50">
        <button onClick={handleCopy} className={`text-[11px] font-bold transition-colors ${copied ? 'text-green-500' : 'text-slate-400'}`}>
          {copied ? '已复制' : '复制内容'}
        </button>
        <button onClick={() => onPlay(res.translation, lang)} className="text-slate-400 active:text-indigo-500">
          <Volume2 size={16} />
        </button>
      </div>
    </div>
  );
});

// ----------------- 4) 主组件 -----------------
export default function AIChatDrawer({ onClose }) {
  const [settings, setSettings] = useState(loadSettings);
  const [translationMode, setTranslationMode] = useState(() => safeStorageGet('ai886_translation_mode') === 'natural' ? 'natural' : 'faithful');
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');
  const [inputVal, setInputVal] = useState('');
  const [images, setImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  // 持久化设置
  useEffect(() => { safeStorageSet('ai886_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { safeStorageSet('ai886_translation_mode', translationMode); }, [translationMode]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  // Framer Motion 拖拽手势：下拉关闭
  const handleDragEnd = (e, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };

  const playTTS = useCallback((text, lang) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = settings.ttsSpeed || 1;
    window.speechSynthesis.speak(utterance);
  }, [settings.ttsSpeed]);

  const callAI = useCallback(async (messages, signal) => {
    const model = settings.models.find(m => m.id === settings.mainModelId);
    const provider = settings.providers.find(p => p.id === model?.providerId);
    if (!model) throw new Error('主模型未配置');
    if (!provider?.key) throw new Error('未配置 API Key');

    const res = await fetch(`${provider.url}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.key}` },
      signal,
      body: JSON.stringify({
        model: model.value, messages, response_format: { type: 'json_object' },
        temperature: translationMode === 'faithful' ? 0.1 : 0.4,
      }),
    });
    if (!res.ok) throw new Error('网络请求失败');
    const data = await res.json();
    return data?.choices?.[0]?.message?.content;
  }, [settings, translationMode]);

  const handleTranslate = useCallback(async (manualText) => {
    const text = typeof manualText === 'string' ? manualText : inputVal;
    const trimmed = (text || '').trim();
    if (!trimmed && images.length === 0) return;

    const currentReqId = ++requestIdRef.current;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    let s = sourceLang, t = targetLang;
    const detected = detectScript(trimmed);
    if (detected && detected === targetLang) { s = targetLang; t = sourceLang; setSourceLang(s); setTargetLang(t); }

    setIsLoading(true); setInputVal('');
    const userMsg = { role: 'user', text: trimmed || '[图片翻译]', images: [...images], id: Date.now() };
    setHistory([userMsg]); setImages([]);

    let userContent = images.length > 0 
      ? [{ type: 'text', text: `源语(${s}) -> 目标语(${t}): ${trimmed || '翻译图片文字'}` }, ...images.map(img => ({ type: 'image_url', image_url: { url: img } }))]
      : `源语(${s}) -> 目标语(${t}): ${trimmed}`;

    try {
      const content = await callAI([
        { role: 'system', content: SYSTEM_PROMPTS[translationMode] },
        { role: 'user', content: userContent }
      ], abortControllerRef.current.signal);

      const parsed = parseJSON(content, null);
      if (!parsed?.data) throw new Error('格式异常');

      setHistory(prev => [...prev, { role: 'ai', results: parsed.data, targetLang: t, id: Date.now() + 1 }]);
      if (settings.autoPlayTTS && parsed.data[0]?.translation) playTTS(parsed.data[0].translation, t);
    } catch (e) {
      if (e.name !== 'AbortError') setHistory(prev => [...prev, { role: 'error', text: e.message || '翻译失败', id: Date.now() + 2 }]);
    } finally {
      if (currentReqId === requestIdRef.current) setIsLoading(false);
    }
  }, [inputVal, images, sourceLang, targetLang, callAI, playTTS, settings.autoPlayTTS, translationMode]);

  const toggleRecording = useCallback(() => {
    if (isLoading) return;
    if (isRecording) { recognitionRef.current?.stop(); return; }
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert('浏览器不支持语音');

    transcriptRef.current = '';
    const rec = new Speech();
    rec.lang = sourceLang; rec.interimResults = true;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e) => {
      let final = transcriptRef.current, interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        e.results[i].isFinal ? (final += e.results[i][0].transcript) : (interim += e.results[i][0].transcript);
      }
      transcriptRef.current = final; setInputVal((final + interim).trim());
    };
    rec.onend = () => { setIsRecording(false); if (transcriptRef.current.trim()) handleTranslate(transcriptRef.current.trim()); };
    rec.onerror = () => setIsRecording(false);
    recognitionRef.current = rec; rec.start();
  }, [isLoading, isRecording, sourceLang, handleTranslate]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const valid = (await Promise.all(files.map(f => compressImage(f).catch(() => null)))).filter(Boolean);
      if (valid.length) setImages(prev => [...prev, ...valid]);
    } finally { e.target.value = ''; }
  };

  const hasInput = inputVal.trim().length > 0 || images.length > 0;

  return (
    <>
      {/* 黑色半透明背景遮罩 */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9990]" 
      />

      {/* 底部向上弹出的主容器 */}
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.8 }}
        onDragEnd={handleDragEnd}
        className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col h-[92vh] sm:h-[85vh] sm:max-w-md sm:mx-auto bg-slate-50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        {/* iOS 风格拖拽指示条 */}
        <div className="w-full flex justify-center pt-3 pb-1 bg-white/80 backdrop-blur-md absolute top-0 z-30">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* 头部 */}
        <header className="flex items-center justify-between px-5 pt-8 pb-3 bg-white/80 backdrop-blur-md border-b border-slate-100 z-20 shrink-0">
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full"><X size={22} /></button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-black text-[13px] tracking-widest text-slate-800">886.AI TRANSLATOR</span>
          </div>
          <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full"><Cog size={20} /></button>
        </header>

        {/* 聊天内容区 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 hide-scrollbar relative">
          {history.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 opacity-60 pointer-events-none">
              <Sparkles size={40} className="mb-3" />
              <p className="text-xs font-bold tracking-widest uppercase">AI 智能翻译引擎</p>
            </div>
          )}

          {history.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                  {msg.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {msg.images.map((img, i) => <img key={i} src={img} className="w-20 h-20 object-cover rounded-md border border-indigo-400" alt="img" />)}
                    </div>
                  )}
                  <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                </div>
              ) : msg.role === 'ai' ? (
                <div className="w-full max-w-[95%]">
                  {msg.results.map((res, i) => <TranslationCard key={i} res={res} lang={msg.targetLang} onPlay={playTTS} />)}
                </div>
              ) : (
                <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 w-full text-center">{msg.text}</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                <RotateCw size={14} className="animate-spin text-indigo-500" />
                <span className="text-[11px] font-bold text-slate-400">正在思考最地道的译文...</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区 */}
        <footer className="p-4 bg-white border-t border-slate-100 space-y-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {/* 控制条 */}
          <div className="flex items-center justify-between px-1">
            <button onClick={() => setTranslationMode(m => m === 'faithful' ? 'natural' : 'faithful')} className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100">
              {translationMode === 'faithful' ? '直译模式' : '口语模式'}
            </button>
            <div className="flex items-center gap-3 bg-slate-50 rounded-full px-1 py-1">
              <span className={`text-[11px] font-black px-3 py-1 rounded-full ${sourceLang==='zh-CN' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>中</span>
              <button onClick={() => { const s = sourceLang; setSourceLang(targetLang); setTargetLang(s); }} className="text-indigo-500"><Languages size={14} /></button>
              <span className={`text-[11px] font-black px-3 py-1 rounded-full ${targetLang==='my-MM' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>缅</span>
            </div>
          </div>

          {/* 图片预览 */}
          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-14 h-14 shrink-0">
                  <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-200" alt="preview" />
                  <button onClick={() => setImages(p => p.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 shadow-sm"><XCircle size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* 输入框 */}
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-1.5 flex items-end">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-indigo-600"><Camera size={18} /></button>
              <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <textarea
                value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (!isLoading) handleTranslate(); } }}
                placeholder="输入要翻译的内容..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] py-2 px-1 max-h-24 resize-none outline-none" rows={1}
              />
            </div>
            
            <button
              disabled={isLoading}
              onClick={isRecording ? toggleRecording : (hasInput ? () => handleTranslate() : toggleRecording)}
              className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center shadow-md transition-all ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 
                (hasInput ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-slate-500 border border-slate-200')
              } ${isLoading ? 'opacity-50' : ''}`}
            >
              {isRecording ? <StopCircle size={20} /> : (hasInput ? <ArrowUp size={20} /> : <Mic size={20} />)}
            </button>
          </div>
        </footer>
      </motion.div>
      <style jsx global>{` .hide-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </>
  );
}

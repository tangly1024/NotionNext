import React, { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';

// ---------- Constants ----------
const MAX_HISTORY = 50;
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'my-MM', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
];

// ---------- Helpers ----------
const detectScript = (text) => {
  if (!text?.trim()) return null;
  if (/[\u1000-\u109F\uAA60-\uAA7F]/.test(text)) return 'my-MM';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko-KR';
  if (/[\u3040-\u30FF\u31F0-\u31FF]/.test(text)) return 'ja-JP';
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th-TH';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU';
  if (/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(text))
    return 'vi-VN';
  if (/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(text)) return 'zh-CN';
  if (/[A-Za-z]/.test(text) && !/[^\x00-\x7F]/.test(text)) return 'en-US';
  return null;
};

const getLangName = (code) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
const getLangFlag = (code) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || '🌐';

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ---------- Mock API for Reply Suggestions ----------
const fetchSmartReplies = async (history, customPrompt) => {
  // 后端接口可根据 history 和 customPrompt 返回 JSON ["回复1","回复2","回复3"]
  // 这里模拟 1秒延迟
  await new Promise((res) => setTimeout(res, 1000));
  return [
    '哈哈真的吗？',
    '那你打算怎么办？',
    '我不信，除非你发张照片看看',
  ];
};

// ---------- Chat Component ----------
export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');
  const [inputVal, setInputVal] = useState('');
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [smartReplies, setSmartReplies] = useState([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const scrollRef = useRef(null);

  // ---------- Append message ----------
  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg].slice(-MAX_HISTORY));
  }, []);

  // ---------- Handle Send ----------
  const handleSendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const msg = { id: nowId(), sender: 'local', text, translatedText: null };
    appendMessage(msg);
    setInputVal('');
    setSmartReplies([]);
    // TODO: 调用后台翻译 API
  }, [appendMessage]);

  // ---------- Detect language ----------
  const handleInputChange = (val) => {
    setInputVal(val);
    const detected = detectScript(val);
    if (detected && detected !== sourceLang && detected !== targetLang) {
      // 自动切换原文/目标语言
      setSourceLang(detected);
      setTargetLang(sourceLang);
    }
  };

  // ---------- Generate Smart Replies ----------
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (isSmartReplyEnabled && lastMsg?.sender === 'remote') {
      setIsRepliesLoading(true);
      fetchSmartReplies(messages.slice(-MAX_HISTORY), customPrompt)
        .then((res) => setSmartReplies(res))
        .finally(() => setIsRepliesLoading(false));
    } else setSmartReplies([]);
  }, [messages, isSmartReplyEnabled, customPrompt]);

  // ---------- Scroll ----------
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, [messages, smartReplies]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">中缅语伴网</span>
          <span>{getLangFlag(sourceLang)}→{getLangFlag(targetLang)}</span>
        </div>
        <label className="flex items-center space-x-1 text-sm">
          <input
            type="checkbox"
            checked={isSmartReplyEnabled}
            onChange={(e) => setIsSmartReplyEnabled(e.target.checked)}
          />
          <span>启用回复建议</span>
        </label>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender==='local'?'items-end':'items-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[70%] ${msg.sender==='local'?'bg-pink-500 text-white':'bg-white border'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Smart Reply */}
      {isSmartReplyEnabled && (smartReplies.length > 0 || isRepliesLoading) && (
        <div className="px-4 pb-2 flex flex-col space-y-2">
          {isRepliesLoading ? (
            <div className="text-xs text-gray-400 text-center animate-pulse">AI 正在思考...</div>
          ) : smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-sm transition-colors shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <textarea
          rows={1}
          className="flex-1 border rounded-full px-4 py-2 resize-none"
          placeholder="输入内容..."
          value={inputVal}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault();handleSendMessage(inputVal)}}}
        />
        <button
          className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center"
          onClick={()=>handleSendMessage(inputVal)}
        >
          <i className="fas fa-arrow-up" />
        </button>
      </div>
    </div>
  );
}

// -----------------------------
// Settings / Language Picker / Provider Switch / User Dict
// -----------------------------

import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';

// 全局样式
export const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .slim-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .slim-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.14); border-radius: 9999px; }
  `}</style>
);

export function LanguagePicker({ title, open, onClose, value, onChange }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[10003]">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0">
        <Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col">
          <div className="font-bold text-center mb-4">{title}</div>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  onClose();
                }}
                className={`p-4 rounded-2xl font-medium text-sm flex items-center ${
                  value === lang.code
                    ? 'bg-pink-50 text-pink-600 border-pink-200 border'
                    : 'bg-gray-50 border border-transparent'
                }`}
              >
                <span className="text-xl mr-3">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// -----------------------------
// Provider Switch
// -----------------------------
export function ProviderSwitch({ settings, setSettings, PROVIDERS, DEFAULT_PROVIDER }) {
  const currentIcon = useMemo(() => {
    if (String(settings.provider).startsWith('custom_')) {
      const currentCustom = (settings.customProviders || []).find(
        (p) => p.id === settings.provider
      );
      return currentCustom?.icon || 'fa-robot';
    }
    return PROVIDERS[settings.provider]?.icon || 'fa-robot';
  }, [settings, PROVIDERS]);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-10 h-10 flex items-center justify-center text-pink-500 rounded-full hover:bg-pink-50 transition-colors">
        <i className={`fas ${currentIcon} text-lg`} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl border overflow-hidden p-1.5 outline-none max-h-64 overflow-y-auto slim-scrollbar">
          <div className="text-xs text-gray-400 font-bold px-3 py-1 mt-1">内置节点</div>
          {Object.values(PROVIDERS).map((provider) => (
            <Menu.Item key={provider.id}>
              {({ active }) => (
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, provider: provider.id }))
                  }
                  className={`flex w-full items-center px-3 py-2.5 text-xs font-bold rounded-xl ${
                    settings.provider === provider.id ? 'bg-pink-50 text-pink-600' : active ? 'bg-gray-50' : ''
                  }`}
                >
                  <i className={`fas ${provider.icon} w-5 text-center`} /> {provider.name}
                </button>
              )}
            </Menu.Item>
          ))}

          {!!settings.customProviders?.length && (
            <>
              <div className="text-xs text-gray-400 font-bold px-3 py-1 mt-2 border-t pt-2">自定义节点</div>
              {settings.customProviders.map((provider) => (
                <Menu.Item key={provider.id}>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, provider: provider.id }))
                      }
                      className={`flex w-full items-center px-3 py-2.5 text-xs font-bold rounded-xl ${
                        settings.provider === provider.id ? 'bg-pink-50 text-pink-600' : active ? 'bg-gray-50' : ''
                      }`}
                    >
                      <i className={`fas ${provider.icon || 'fa-robot'} w-5 text-center`} /> {provider.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// -----------------------------
// Settings Modal
// -----------------------------
export function SettingsModal({ settings, onSave, onClose, PROVIDERS, DEFAULT_PROVIDER }) {
  const [data, setData] = useState({ ...settings });

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} className="relative z-[10002]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          <div className="flex bg-gray-50/50 rounded-t-3xl border-b">
            <button className="flex-1 py-4 text-sm font-bold text-pink-600 bg-white shadow-sm">
              通用设置
            </button>
          </div>

          <div className="p-6 overflow-y-auto slim-scrollbar flex-1 space-y-4">
            {/* 回译 */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">开启回译</span>
              <input
                type="checkbox"
                checked={data.enableBackTranslation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, enableBackTranslation: e.target.checked }))
                }
                className="w-5 h-5 accent-pink-500"
              />
            </div>

            {/* 自动朗读 */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">自动朗读</span>
              <input
                type="checkbox"
                checked={data.autoPlayTTS}
                onChange={(e) => setData((prev) => ({ ...prev, autoPlayTTS: e.target.checked }))}
                className="w-5 h-5 accent-pink-500"
              />
            </div>

            {/* 自定义提示词 */}
            <div>
              <label className="text-sm font-bold mb-1 block">自定义提示词（可选）</label>
              <textarea
                className="w-full border rounded-xl p-3 text-sm h-24"
                placeholder="例如：请使用敬语翻译..."
                value={data.customPrompt || ''}
                onChange={(e) => setData((prev) => ({ ...prev, customPrompt: e.target.value }))}
              />
            </div>
          </div>

          <div className="p-5 border-t">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              保存配置
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { saveToUserDict, getAllUserDict, deleteUserDictEntry, clearUserDict } from '@/lib/userDict';
import { compressImage } from './utils';
import { playBeep } from './utils';
import { detectScript } from './utils';

// -----------------------------
// Translation / History Card
// -----------------------------
export const TranslationCard = ({ data, onPlay, originalText, srcLang, tgtLang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    } catch {}
  };

  const handleEdit = async () => {
    const next = prompt('修改并保存到用户词典（之后将优先应用该翻译）：', data.translation);
    if (!next?.trim() || next.trim() === data.translation) return;
    await saveToUserDict(srcLang, tgtLang, originalText, next.trim());
    alert('已保存到用户词典');
  };

  return (
    <div
      onClick={handleCopy}
      className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative group mb-3"
    >
      {copied && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10 rounded-2xl">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span>
        </div>
      )}

      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">
        {data.translation}
      </div>

      {data.back_translation && (
        <div className="mt-2 text-[13px] text-gray-400 break-words whitespace-pre-wrap">
          {data.back_translation}
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="p-2 text-gray-300 hover:text-blue-500 opacity-50 hover:opacity-100"
        >
          <i className="fas fa-edit" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="p-2 text-gray-300 hover:text-pink-500 opacity-50 hover:opacity-100"
        >
          <i className="fas fa-volume-up" />
        </button>
      </div>
    </div>
  );
};

// -----------------------------
// User Dict Panel
// -----------------------------
export function UserDictPanel() {
  const [dictList, setDictList] = useState([]);

  const loadDict = useCallback(async () => {
    const list = await getAllUserDict();
    setDictList(list);
  }, []);

  useEffect(() => {
    loadDict();
  }, [loadDict]);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const list = JSON.parse(evt.target?.result || '[]');
        for (const item of list) {
          await saveToUserDict(item.srcLang, item.tgtLang, item.source, item.translation);
        }
        await loadDict();
        alert('导入成功');
      } catch {
        alert('JSON 格式错误');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(dictList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_dict.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleClear = async () => {
    if (!window.confirm('确认清空全部用户词典？')) return;
    await clearUserDict();
    await loadDict();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className="flex-1 bg-pink-50 text-pink-600 text-center py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-pink-100 transition-colors">
          导入 JSON
          <input type="file" accept=".json" hidden onChange={handleImport} />
        </label>
        <button
          onClick={handleExport}
          className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
        >
          导出 JSON
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-2 min-h-[200px] max-h-[300px] overflow-y-auto slim-scrollbar">
        {!dictList.length ? (
          <p className="text-center text-gray-400 mt-10 text-sm">暂无自定义词条</p>
        ) : (
          dictList.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-2 rounded-lg mb-2 shadow-sm border"
            >
              <div className="text-xs overflow-hidden">
                <div className="font-bold text-gray-700 truncate">{item.source}</div>
                <div className="text-pink-500 truncate">{item.translation}</div>
              </div>
              <button
                onClick={async () => {
                  await deleteUserDictEntry(item.id);
                  await loadDict();
                }}
                className="text-red-400 p-2"
              >
                <i className="fas fa-trash" />
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleClear}
        className="w-full text-red-500 text-sm py-2 border border-red-100 rounded-xl font-bold hover:bg-red-50"
      >
        清空所有词典
      </button>
    </div>
  );
}

// -----------------------------
// Reply Suggestions / 气囊
// -----------------------------
export function ReplyBubbles({ replies, onSelect, layout = 'vertical' }) {
  if (!replies?.length) return null;
  return (
    <div
      className={`flex ${layout === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-2 overflow-x-auto pb-2'}`}
    >
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className="text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-sm transition-colors shadow-sm flex-shrink-0"
        >
          {reply}
        </button>
      ))}
    </div>
  );
        }
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TranslationCard, ReplyBubbles } from './TranslationCard';
import { useTranslator } from './useTranslator';
import { useSpeechInput } from './useSpeechInput';
import { useTTS } from './useTTS';
import { compressImage } from './utils';
import { detectScript, getLangName, getLangFlag } from './utils';

export default function AiChatContent() {
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');
  const [inputImages, setInputImages] = useState([]);
  const [replySuggestions, setReplySuggestions] = useState([]);
  const [showBubbles, setShowBubbles] = useState(true);
  const scrollRef = useRef(null);

  const { playTTS } = useTTS();

  const { history, isLoading, translate } = useTranslator({
    settings: {}, // 假设已传递用户设置
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    playTTS,
  });

  const {
    displayValue: inputVal,
    setManualValue,
    hardResetBuffers,
    startRecording,
    stopRecording,
  } = useSpeechInput({
    sourceLang,
    delayMs: 1800,
    onSend: (text) => {
      handleTranslate(text);
    },
  });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading, scrollToBottom]);

  const handleTranslate = useCallback(
    async (overrideText = null) => {
      let text = String(overrideText ?? inputVal).trim();
      if (!text && !inputImages.length) return;

      // 自动识别语言
      const detected = detectScript(text);
      let src = sourceLang;
      let tgt = targetLang;
      if (detected && detected !== src) {
        if (detected === tgt) {
          [src, tgt] = [tgt, src];
        } else {
          src = detected;
        }
        setSourceLang(src);
        setTargetLang(tgt);
      }

      await translate({
        text,
        images: inputImages,
        resetComposer: () => {
          hardResetBuffers();
          setInputImages([]);
        },
      });
    },
    [inputVal, inputImages, sourceLang, targetLang, translate, hardResetBuffers]
  );

  const handleImageInput = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setInputImages((prev) => [...prev, ...compressed]);
      e.target.value = '';
    },
    []
  );

  const swapLanguages = useCallback(() => {
    [sourceLang, targetLang] = [targetLang, sourceLang];
    setSourceLang(sourceLang);
    setTargetLang(targetLang);
  }, [sourceLang, targetLang]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 relative">
      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {history.map((item) => (
          <div key={item.id} className={`mb-4 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
            {item.role === 'user' ? (
              <div className="flex flex-col max-w-[80%] items-end">
                {item.images?.map((img, i) => (
                  <img key={i} src={img} className="w-24 h-24 object-cover rounded-xl mb-2" />
                ))}
                <div className="bg-pink-500 text-white px-4 py-2 rounded-2xl text-sm">{item.text}</div>
              </div>
            ) : (
              <div className="flex flex-col max-w-[85%]">
                {item.results?.map((res, idx) => (
                  <TranslationCard
                    key={`${item.id}_${idx}`}
                    data={res}
                    originalText={item.originalText}
                    srcLang={item.srcLang}
                    tgtLang={item.tgtLang}
                    onPlay={() => playTTS(res.translation, item.tgtLang)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-pink-500 font-bold">
            <i className="fas fa-circle-notch fa-spin mr-2" /> 翻译中...
          </div>
        )}
      </div>

      {/* 追问气囊 / 回复建议 */}
      {showBubbles && replySuggestions.length > 0 && (
        <ReplyBubbles
          replies={replySuggestions}
          onSelect={(text) => handleTranslate(text)}
          layout="vertical"
        />
      )}

      {/* 输入区域 */}
      <div className="flex items-end p-4 bg-white border-t gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageInput}
          className="hidden"
          id="imageInput"
        />
        <label htmlFor="imageInput" className="cursor-pointer text-gray-400 hover:text-pink-500">
          <i className="fas fa-image text-lg" />
        </label>

        <textarea
          className="flex-1 border-none outline-none resize-none px-3 py-2 rounded-2xl bg-gray-100"
          placeholder="输入内容..."
          value={inputVal}
          onChange={(e) => setManualValue(e.target.value)}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleTranslate();
            }
          }}
        />

        <button
          onClick={() => (inputVal.trim() ? handleTranslate() : startRecording())}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            inputVal.trim() ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-500'
          }`}
        >
          <i className={`fas ${inputVal.trim() ? 'fa-arrow-up' : 'fa-microphone'}`} />
        </button>
      </div>
    </div>
  );
            }

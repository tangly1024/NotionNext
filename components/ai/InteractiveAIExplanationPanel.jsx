'use client';

import React, { useState, useRef } from 'react';
import { FaMicrophone, FaKeyboard, FaClosedCaptioning } from 'react-icons/fa';

const LANGUAGES = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'my', label: 'မြန်မာစာ', flag: '🇲🇲' }
];

export default function BottomVoiceControl({
  textMode,
  setTextMode,
  inputText,
  setInputText,
  sendMessage,
  isRecording,
  handleMicPointerDown,
  handleMicPointerUp,
  handleMicPointerCancel,
  showText,
  setShowText
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const longPressTimer = useRef(null);

  const handleMicDown = (e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setShowLangMenu(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 350);
    handleMicPointerDown(e, currentLang.code);
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
    setCurrentLang(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="flex-none bg-[#f8fafc] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+80px)] z-30">
      <div className="flex items-end justify-center gap-5 max-w-lg mx-auto relative">
        {/* 模式切换 */}
        <button
          onClick={() => setTextMode(!textMode)}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 active:scale-95 transition shadow-sm mb-[2px]"
        >
          {textMode ? <FaMicrophone size={20} /> : <FaKeyboard size={20} />}
        </button>

        {/* 语音按钮 */}
        <div className="relative flex justify-center">
          <button
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            onPointerCancel={handleMicCancel}
            onPointerLeave={handleMicCancel}
            onContextMenu={(e) => e.preventDefault()}
            className={`h-20 w-20 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md ${
              isRecording ? 'bg-pink-500 scale-110 shadow-[0_4px_20px_rgba(236,72,153,0.5)] animate-pulse-ring' : 'bg-pink-500'
            }`}
          >
            {isRecording ? <FaKeyboard size={28} /> : <FaMicrophone size={32} />}
          </button>

          {/* 长按语言选择菜单 */}
          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-[50]"
                onPointerDown={() => setShowLangMenu(false)}
              />
              <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl p-2 w-[260px] max-h-[300px] overflow-y-auto z-[60] no-scrollbar">
                <div className="grid grid-cols-2 gap-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onPointerDown={(e) => selectLang(e, lang)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition"
                    >
                      <span className="text-[14px] font-medium text-slate-700">{lang.label}</span>
                      <span className="text-xl">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 字幕按钮 */}
        <button
          onClick={() => setShowText(!showText)}
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition ${
            showText ? 'bg-pink-50 border-pink-300 text-pink-500' : 'bg-white border-slate-200 text-slate-400'
          }`}
        >
          <FaClosedCaptioning size={22} />
        </button>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaKeyboard, FaClosedCaptioning } from 'react-icons/fa';

export default function BottomVoiceControlEnhanced({
  textMode,
  setTextMode,
  inputText,
  setInputText,
  sendMessage,
  isRecording,
  handleMicPointerDown,
  handleMicPointerUp,
  handleMicPointerCancel,
  showText,
  setShowText,
}) {
  const LANGUAGES = [
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'my', label: 'မြန်မာစာ', flag: '🇲🇲' },
  ];

  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState(LANGUAGES[0]);
  const longPressTimer = React.useRef(null);

  const handleMicDown = (e) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setShowLangMenu(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 350);
    handleMicPointerDown(e, currentLang.code);
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
    setCurrentLang(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="flex-none bg-[#f8fafc] px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+80px)] z-30">
      <div className="flex items-end justify-center gap-5 max-w-lg mx-auto relative">

        {/* 模式切换 */}
        <button
          onClick={() => setTextMode(!textMode)}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 active:scale-95 transition shadow-sm mb-[2px]"
        >
          {textMode ? <FaMicrophone size={20} /> : <FaKeyboard size={20} />}
        </button>

        {/* 语音按钮 */}
        <div className="relative flex justify-center">
          <button
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            onPointerCancel={handleMicCancel}
            onPointerLeave={handleMicCancel}
            onContextMenu={(e) => e.preventDefault()}
            className={`h-20 w-20 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md ${
              isRecording
                ? 'bg-pink-500 scale-110 shadow-[0_4px_20px_rgba(236,72,153,0.5)] animate-pulse-ring'
                : 'bg-pink-500 hover:scale-105'
            }`}
          >
            {isRecording ? <FaKeyboard size={28} /> : <FaMicrophone size={32} />}
          </button>

          {/* 长按语言选择菜单 */}
          <AnimatePresence>
            {showLangMenu && (
              <>
                <motion.div
                  className="fixed inset-0 z-[50]"
                  onPointerDown={() => setShowLangMenu(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-[90px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl p-2 w-[260px] max-h-[300px] overflow-y-auto z-[60] no-scrollbar"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onPointerDown={(e) => selectLang(e, lang)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                          currentLang.code === lang.code
                            ? 'bg-blue-50 border border-blue-200 text-blue-600'
                            : 'hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-transparent'
                        }`}
                      >
                        <span className="text-[14px] font-medium">{lang.label}</span>
                        <span className="text-xl">{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* 字幕按钮 */}
        <button
          onClick={() => setShowText(!showText)}
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition ${
            showText ? 'bg-pink-50 border-pink-300 text-pink-500' : 'bg-white border-slate-200 text-slate-400 hover:text-pink-500'
          }`}
        >
          <FaClosedCaptioning size={22} />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RECOGNITION_LANGS } from './aiConfig';

export default function RecognitionLanguagePicker({
  open,
  recLang,
  setRecLang,
  onClose,
  theme = 'light'
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  const dark = theme === 'dark';

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="关闭语言选择"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-sm rounded-3xl border p-6 shadow-2xl animate-[fadeIn_.18s_ease-out] ${
          dark ? 'border-white/10 bg-slate-800' : 'border-slate-200 bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`mb-4 text-center text-lg font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
          选择识别语言
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {RECOGNITION_LANGS.map((lang) => {
            const active = recLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setRecLang(lang.code);
                  onClose();
                }}
                className={`rounded-2xl border p-4 transition-all active:scale-95 ${
                  active
                    ? dark
                      ? 'border-pink-500 bg-pink-500/20 shadow-[0_0_0_1px_rgba(236,72,153,.15)]'
                      : 'border-pink-500 bg-pink-50 shadow-[0_0_0_1px_rgba(236,72,153,.15)]'
                    : dark
                    ? 'border-white/10 bg-white/5 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`text-xs font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {lang.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}


import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { TTS_VOICES, toFinite } from './aiConfig';
import { DEFAULT_CHAT_PROMPT } from './aiPrompts';

export default function AISettingsModal({
  open,
  settings,
  updateSettings,
  onClose
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-800 border border-white/10 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white">⚙️ AI 设置</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200 text-sm">
          <div className="space-y-3">
            <div className="font-bold text-slate-400 text-xs">API 配置</div>

            <input
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
              placeholder="API URL"
              value={settings.apiUrl || ''}
              onChange={(e) => updateSettings({ apiUrl: e.target.value }, true)}
            />

            <input
              type="password"
              autoComplete="off"
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none text-slate-200"
              placeholder="API Key"
              value={settings.apiKey || ''}
              onChange={(e) => updateSettings({ apiKey: e.target.value }, true)}
            />

            <input
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
              placeholder="Model"
              value={settings.model || ''}
              onChange={(e) => updateSettings({ model: e.target.value }, true)}
            />
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="font-bold text-slate-400 text-xs">当前场景参数</div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400 w-16">温度</label>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.05"
                className="flex-1 accent-pink-500"
                value={settings.temperature ?? 0.7}
                onChange={(e) => updateSettings({ temperature: toFinite(e.target.value, 0.7) }, false)}
              />
              <input
                type="number"
                step="0.05"
                className="w-16 bg-slate-900/50 border border-white/10 rounded-md px-1 py-1 text-center text-xs outline-none"
                value={settings.temperature ?? 0.7}
                onChange={(e) => updateSettings({ temperature: toFinite(e.target.value, 0.7) }, false)}
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="font-bold text-slate-400 text-xs flex justify-between">
              <span>系统提示词</span>
              <button
                onClick={() => updateSettings({ systemPrompt: DEFAULT_CHAT_PROMPT }, false)}
                className="text-pink-400"
              >
                重置
              </button>
            </div>
            <textarea
              rows={7}
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
              value={settings.systemPrompt || ''}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value }, false)}
            />
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
            <div className="font-bold text-slate-400 text-xs">TTS 发音配置</div>

            <input
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
              placeholder="TTS API URL"
              value={settings.ttsApiUrl || ''}
              onChange={(e) => updateSettings({ ttsApiUrl: e.target.value }, true)}
            />

            <select
              className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none appearance-none"
              value={settings.ttsVoice || ''}
              onChange={(e) => updateSettings({ ttsVoice: e.target.value }, true)}
            >
              {TTS_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 w-10">语速</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  className="flex-1 accent-pink-500"
                  value={settings.ttsSpeed ?? 0}
                  onChange={(e) => updateSettings({ ttsSpeed: toFinite(e.target.value, 0) }, true)}
                />
                <input
                  type="number"
                  step="1"
                  className="w-16 bg-slate-900/50 border border-white/10 rounded-md px-1 py-1 text-center text-xs outline-none"
                  value={settings.ttsSpeed ?? 0}
                  onChange={(e) => updateSettings({ ttsSpeed: toFinite(e.target.value, 0) }, true)}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 w-10">音调</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.01"
                  className="flex-1 accent-pink-500"
                  value={settings.ttsPitch ?? 0}
                  onChange={(e) => updateSettings({ ttsPitch: toFinite(e.target.value, 0) }, true)}
                />
                <input
                  type="number"
                  step="0.01"
                  className="w-16 bg-slate-900/50 border border-white/10 rounded-md px-1 py-1 text-center text-xs outline-none"
                  value={settings.ttsPitch ?? 0}
                  onChange={(e) => updateSettings({ ttsPitch: toFinite(e.target.value, 0) }, true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

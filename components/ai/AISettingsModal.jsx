'use client';

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { AI_PROVIDERS, getProviderModels } from './aiProviders';
import { getAssistantsByScene } from './aiAssistants';
import { SCENE_LABELS, TTS_VOICES, toFinite } from './aiConfig';

function LogoBadge({ logoUrl, shortName = 'AI', name = '' }) {
  const [failed, setFailed] = React.useState(false);

  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="h-8 w-8 rounded-full bg-white object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-slate-200">
      {shortName}
    </div>
  );
}

export default function AISettingsModal({
  open,
  scene,
  allSettings,
  updateSharedSettings,
  updateSceneSettings,
  selectProvider,
  selectAssistant,
  resetScenePrompt,
  onClose
}) {
  if (!open) return null;

  const shared = allSettings?.shared || {};
  const sceneState = allSettings?.scenes?.[scene] || {};
  const assistants = getAssistantsByScene(scene);
  const models = getProviderModels(shared.providerId);

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/10 bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="font-bold text-white">⚙️ AI 设置</h3>
            <p className="mt-1 text-xs text-slate-400">当前场景：{SCENE_LABELS[scene] || scene}</p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm text-slate-200">
          <div className="space-y-3">
            <div className="font-bold text-slate-400 text-xs">服务商</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {AI_PROVIDERS.map((provider) => {
                const active = shared.providerId === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => selectProvider(provider.id)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_0_1px_rgba(236,72,153,.2)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LogoBadge
                        logoUrl={provider.logoUrl}
                        shortName={provider.shortName}
                        name={provider.name}
                      />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-white">{provider.name}</div>
                        <div className="truncate text-[11px] text-slate-400">
                          {provider.baseUrl || '自定义地址'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-bold text-slate-400 text-xs">模型</div>
              <select
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
                value={shared.model || ''}
                onChange={(e) => updateSharedSettings({ model: e.target.value })}
              >
                {models.length === 0 ? (
                  <option value="">请直接在下面输入模型名</option>
                ) : (
                  models.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))
                )}
              </select>

              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
                placeholder="也可以直接手动输入模型名"
                value={shared.model || ''}
                onChange={(e) => updateSharedSettings({ model: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-400 text-xs">API URL</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
                placeholder="API URL"
                value={shared.apiUrl || ''}
                onChange={(e) => updateSharedSettings({ apiUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-400 text-xs">API Key</div>
            <input
              type="password"
              autoComplete="off"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none text-slate-200"
              placeholder="填写服务商密钥"
              value={shared.apiKey || ''}
              onChange={(e) => updateSharedSettings({ apiKey: e.target.value })}
            />
            <p className="text-[11px] leading-5 text-amber-300/90">
              前端直接存 API Key 只适合你自己调试。只要页面对别人开放，就一定要改成后端代理。
            </p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="font-bold text-slate-400 text-xs">当前场景助手</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {assistants.map((assistant) => {
                const active = sceneState.assistantId === assistant.id;
                return (
                  <button
                    key={assistant.id}
                    type="button"
                    onClick={() => selectAssistant(scene, assistant.id)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_0_1px_rgba(236,72,153,.2)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-2xl">{assistant.icon}</span>
                      <span className="font-semibold text-white">{assistant.name}</span>
                    </div>
                    <div className="text-xs leading-5 text-slate-400">{assistant.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="font-bold text-slate-400 text-xs">当前场景参数</div>

              <div className="flex items-center gap-3">
                <label className="w-16 text-xs text-slate-400">温度</label>
                <input
                  type="range"
                  min="0"
                  max="1.2"
                  step="0.05"
                  className="flex-1 accent-pink-500"
                  value={sceneState.temperature ?? 0.7}
                  onChange={(e) => updateSceneSettings(scene, { temperature: toFinite(e.target.value, 0.7) })}
                />
                <input
                  type="number"
                  step="0.05"
                  className="w-16 rounded-md border border-white/10 bg-slate-900/50 px-1 py-1 text-center text-xs outline-none"
                  value={sceneState.temperature ?? 0.7}
                  onChange={(e) => updateSceneSettings(scene, { temperature: toFinite(e.target.value, 0.7) })}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="w-16 text-xs text-slate-400">静默发送</label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  className="flex-1 accent-pink-500"
                  value={sceneState.asrSilenceMs ?? 1500}
                  onChange={(e) => updateSceneSettings(scene, { asrSilenceMs: toFinite(e.target.value, 1500) })}
                />
                <input
                  type="number"
                  step="100"
                  className="w-16 rounded-md border border-white/10 bg-slate-900/50 px-1 py-1 text-center text-xs outline-none"
                  value={sceneState.asrSilenceMs ?? 1500}
                  onChange={(e) => updateSceneSettings(scene, { asrSilenceMs: toFinite(e.target.value, 1500) })}
                />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <span className="text-sm text-slate-200">默认显示文字内容</span>
                <input
                  type="checkbox"
                  checked={Boolean(sceneState.showText)}
                  onChange={(e) => updateSceneSettings(scene, { showText: e.target.checked })}
                />
              </label>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-slate-400 text-xs">系统提示词 / 助手指令</div>
              <div className="flex justify-end">
                <button onClick={() => resetScenePrompt(scene)} className="text-pink-400">
                  重置为当前助手默认指令
                </button>
              </div>
              <textarea
                rows={10}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
                value={sceneState.systemPrompt || ''}
                onChange={(e) => updateSceneSettings(scene, { systemPrompt: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
            <div className="font-bold text-slate-400 text-xs">TTS 共享配置</div>

            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
              placeholder="TTS API URL"
              value={shared.ttsApiUrl || ''}
              onChange={(e) => updateSharedSettings({ ttsApiUrl: e.target.value })}
            />

            <select
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 outline-none"
              value={shared.ttsVoice || ''}
              onChange={(e) => updateSharedSettings({ ttsVoice: e.target.value })}
            >
              {TTS_VOICES.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="w-10 text-xs text-slate-400">语速</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  className="flex-1 accent-pink-500"
                  value={shared.ttsSpeed ?? 0}
                  onChange={(e) => updateSharedSettings({ ttsSpeed: toFinite(e.target.value, 0) })}
                />
                <input
                  type="number"
                  step="1"
                  className="w-16 rounded-md border border-white/10 bg-slate-900/50 px-1 py-1 text-center text-xs outline-none"
                  value={shared.ttsSpeed ?? 0}
                  onChange={(e) => updateSharedSettings({ ttsSpeed: toFinite(e.target.value, 0) })}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="w-10 text-xs text-slate-400">音调</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.01"
                  className="flex-1 accent-pink-500"
                  value={shared.ttsPitch ?? 0}
                  onChange={(e) => updateSharedSettings({ ttsPitch: toFinite(e.target.value, 0) })}
                />
                <input
                  type="number"
                  step="0.01"
                  className="w-16 rounded-md border border-white/10 bg-slate-900/50 px-1 py-1 text-center text-xs outline-none"
                  value={shared.ttsPitch ?? 0}
                  onChange={(e) => updateSharedSettings({ ttsPitch: toFinite(e.target.value, 0) })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

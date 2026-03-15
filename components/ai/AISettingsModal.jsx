import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import {
  PROVIDERS,
  EXERCISE_ASSISTANTS,
  getProviderById,
  getDefaultModelByProvider,
  getExerciseAssistantById
} from '../interactiveQuiz/interactiveSettings';

const ZH_VOICE_OPTIONS = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓 (女)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰 (男)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓标准' },
  { id: 'zh-CN-YunxiNeural', name: '云希' },
  { id: 'zh-CN-YunjianNeural', name: '云健' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊' }
];

const MY_VOICE_OPTIONS = [
  { id: 'my-MM-ThihaNeural', name: 'Thiha' },
  { id: 'my-MM-NilarNeural', name: 'Nilar' }
];

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
        active
          ? 'border-violet-300 bg-violet-50 text-violet-700'
          : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}

export default function AISettingsModal({
  open,
  settings,
  updateSettings,
  onClose,
  scene = 'exercise'
}) {
  const [mounted, setMounted] = useState(false);

  const assistants = useMemo(() => {
    if (scene === 'exercise') return EXERCISE_ASSISTANTS;
    return EXERCISE_ASSISTANTS;
  }, [scene]);

  const provider = getProviderById(settings?.providerId);
  const currentAssistant = getExerciseAssistantById(settings?.assistantId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  const handleProviderChange = (providerId) => {
    const nextProvider = getProviderById(providerId);
    const currentModel = settings?.model || '';
    const nextModel =
      nextProvider.allowCustomModel || nextProvider.models.includes(currentModel)
        ? currentModel || getDefaultModelByProvider(providerId)
        : getDefaultModelByProvider(providerId);

    updateSettings({
      providerId,
      apiUrl: nextProvider.allowCustomApiUrl ? settings?.apiUrl || '' : nextProvider.apiUrl,
      model: nextModel
    });
  };

  const handleAssistantChange = (assistantId) => {
    const assistant = getExerciseAssistantById(assistantId);
    updateSettings({
      assistantId,
      systemPrompt: assistant.prompt
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-base font-black text-slate-800">AI 设置</div>
            <div className="mt-1 text-xs font-bold text-slate-400">
              选择服务商、模型、密钥和讲题助手
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-700">
          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              服务商
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((item) => (
                <ChoiceButton
                  key={item.id}
                  active={settings?.providerId === item.id}
                  onClick={() => handleProviderChange(item.id)}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </ChoiceButton>
              ))}
            </div>
          </div>

          {provider?.allowCustomApiUrl ? (
            <div className="mb-6">
              <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                自定义接口地址
              </div>
              <input
                className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none"
                placeholder="例如 https://xxx.com/v1"
                value={settings?.apiUrl || ''}
                onChange={(e) => updateSettings({ apiUrl: e.target.value })}
              />
            </div>
          ) : null}

          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              模型
            </div>

            {provider?.allowCustomModel ? (
              <input
                className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none"
                placeholder="输入模型名"
                value={settings?.model || ''}
                onChange={(e) => updateSettings({ model: e.target.value })}
              />
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {(provider?.models || []).map((model) => (
                  <ChoiceButton
                    key={model}
                    active={settings?.model === model}
                    onClick={() => updateSettings({ model })}
                  >
                    {model}
                  </ChoiceButton>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              API Key
            </div>
            <input
              type="password"
              autoComplete="off"
              className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="输入密钥"
              value={settings?.apiKey || ''}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              讲题助手
            </div>
            <div className="grid grid-cols-1 gap-2">
              {assistants.map((assistant) => (
                <button
                  key={assistant.id}
                  type="button"
                  onClick={() => handleAssistantChange(assistant.id)}
                  className={`rounded-2xl border-2 px-3 py-3 text-left transition ${
                    settings?.assistantId === assistant.id
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-black text-slate-800">
                    <span className="mr-2">{assistant.icon}</span>
                    {assistant.name}
                  </div>
                  <div className="mt-1 text-xs font-bold text-slate-400">
                    选中后会自动填入对应提示词
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                系统提示词
              </div>
              <button
                type="button"
                className="text-xs font-black text-violet-600"
                onClick={() =>
                  updateSettings({
                    systemPrompt: currentAssistant.prompt
                  })
                }
              >
                重置为当前助手
              </button>
            </div>
            <textarea
              rows={6}
              className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="可自行微调"
              value={settings?.systemPrompt || ''}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              AI 温度
            </div>
            <input
              type="range"
              min="0"
              max="1.2"
              step="0.05"
              value={settings?.temperature ?? 0.2}
              onChange={(e) => updateSettings({ temperature: Number(e.target.value) })}
              className="w-full"
            />
            <div className="mt-1 text-xs font-bold text-slate-400">
              当前：{settings?.temperature ?? 0.2}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              TTS 接口
            </div>
            <input
              className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none"
              placeholder="TTS API URL"
              value={settings?.ttsApiUrl || ''}
              onChange={(e) => updateSettings({ ttsApiUrl: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              中文声音
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ZH_VOICE_OPTIONS.map((item) => (
                <ChoiceButton
                  key={item.id}
                  active={settings?.zhVoice === item.id}
                  onClick={() => updateSettings({ zhVoice: item.id })}
                >
                  {item.name}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
              缅语声音
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MY_VOICE_OPTIONS.map((item) => (
                <ChoiceButton
                  key={item.id}
                  active={settings?.myVoice === item.id}
                  onClick={() => updateSettings({ myVoice: item.id })}
                >
                  {item.name}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateSettings({ vibration: !settings?.vibration })}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-black ${
                settings?.vibration
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              震动反馈：{settings?.vibration ? '开' : '关'}
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ soundFx: !settings?.soundFx })}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-black ${
                settings?.soundFx
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              音效反馈：{settings?.soundFx ? '开' : '关'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

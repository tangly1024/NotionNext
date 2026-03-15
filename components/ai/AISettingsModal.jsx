import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
      className={`relative rounded-xl border px-3 py-3 text-sm font-bold transition flex items-center justify-center ${
        active
          ? 'border-violet-500 bg-violet-600 text-white shadow-md ring-2 ring-violet-200'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
      }`}
    >
      {active && <span className="absolute right-2 top-2 text-[10px]">✓</span>}
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
  // 新增：折叠面板状态（默认打开核心配置）
  const [expandedSection, setExpandedSection] = useState('core'); 

  const assistants = useMemo(() => {
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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const AccordionHeader = ({ id, title }) => (
    <div 
      className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
      onClick={() => toggleSection(id)}
    >
      <span className="font-bold text-slate-700">{title}</span>
      {expandedSection === id ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[2147483600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
          <div>
            <div className="text-[17px] font-black text-slate-800">AI 设置</div>
            <div className="mt-1 text-[11px] font-bold text-slate-400">
              配置服务商、模型与语音反馈
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
          
          {/* Section 1: 核心配置 */}
          <div className="space-y-3">
            <AccordionHeader id="core" title="1. 核心模型配置" />
            {expandedSection === 'core' && (
              <div className="px-2 pt-2 pb-4 space-y-4 animate-fadeIn">
                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">服务商</div>
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

                {provider?.allowCustomApiUrl && (
                  <div>
                    <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">接口地址</div>
                    <input
                      className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="例如 https://xxx.com/v1"
                      value={settings?.apiUrl || ''}
                      onChange={(e) => updateSettings({ apiUrl: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">模型</div>
                  {provider?.allowCustomModel ? (
                    <input
                      className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
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

                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">API Key</div>
                  <input
                    type="password"
                    autoComplete="off"
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="输入密钥"
                    value={settings?.apiKey || ''}
                    onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: 讲题助手 */}
          <div className="space-y-3">
            <AccordionHeader id="assistant" title="2. 讲题助手与设定" />
            {expandedSection === 'assistant' && (
              <div className="px-2 pt-2 pb-4 space-y-4 animate-fadeIn">
                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">讲题助手角色</div>
                  <div className="grid grid-cols-1 gap-2">
                    {assistants.map((assistant) => (
                      <button
                        key={assistant.id}
                        type="button"
                        onClick={() => handleAssistantChange(assistant.id)}
                        className={`relative rounded-2xl border-2 px-4 py-3 text-left transition ${
                          settings?.assistantId === assistant.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {settings?.assistantId === assistant.id && <span className="absolute right-3 top-3 text-violet-600 font-bold">✓</span>}
                        <div className="font-black text-slate-800 flex items-center">
                          <span className="mr-2 text-xl">{assistant.icon}</span>
                          {assistant.name}
                        </div>
                        <div className="mt-1.5 text-xs font-bold text-slate-400 leading-tight">
                          选中后会自动填入对应提示词
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">系统提示词 (微调)</div>
                    <button
                      type="button"
                      className="text-[11px] font-black text-violet-600 active:scale-95 transition"
                      onClick={() => updateSettings({ systemPrompt: currentAssistant.prompt })}
                    >
                      重置为当前助手
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 leading-relaxed"
                    placeholder="可自行微调"
                    value={settings?.systemPrompt || ''}
                    onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                  />
                </div>

                <div>
                  <div className="mb-1 flex justify-between">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">AI 发散温度</div>
                    <div className="text-[11px] font-black text-violet-500">{settings?.temperature ?? 0.2}</div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.2"
                    step="0.05"
                    value={settings?.temperature ?? 0.2}
                    onChange={(e) => updateSettings({ temperature: Number(e.target.value) })}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: 语音与反馈 */}
          <div className="space-y-3">
            <AccordionHeader id="voice" title="3. 语音引擎与反馈" />
            {expandedSection === 'voice' && (
              <div className="px-2 pt-2 pb-4 space-y-4 animate-fadeIn">
                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">TTS 接口</div>
                  <input
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-violet-400"
                    placeholder="TTS API URL"
                    value={settings?.ttsApiUrl || ''}
                    onChange={(e) => updateSettings({ ttsApiUrl: e.target.value })}
                  />
                </div>

                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">中文发音人</div>
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

                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">缅语发音人</div>
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

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ vibration: !settings?.vibration })}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-black transition ${
                      settings?.vibration
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    震动：{settings?.vibration ? '已开启' : '已关闭'}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSettings({ soundFx: !settings?.soundFx })}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-black transition ${
                      settings?.soundFx
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    音效：{settings?.soundFx ? '已开启' : '已关闭'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

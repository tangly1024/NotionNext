import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
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

function ChoiceButton({ active, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center justify-center rounded-xl border-2 px-3 py-3 text-[14px] font-bold transition-all duration-200 ease-out active:scale-[0.98]
        ${
          active
            ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_2px_10px_-3px_rgba(139,92,246,0.2)]'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
      {icon ? (
        <span
          className={`mr-2 text-lg transition-colors ${
            active
              ? 'text-violet-600'
              : 'text-slate-400 group-hover:text-slate-500'
          }`}
        >
          {icon}
        </span>
      ) : null}

      <span className="relative z-10">{children}</span>

      <div
        className={`absolute right-3 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200
          ${
            active
              ? 'scale-100 bg-violet-500 opacity-100'
              : 'scale-50 bg-transparent opacity-0'
          }`}
      >
        <FaCheck size={8} className="text-white" />
      </div>
    </button>
  );
}

function SwitchRow({ label, checked, onChange, desc }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left transition-all duration-200 active:scale-[0.99] ${
        checked
          ? 'border-violet-200 bg-violet-50/50'
          : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <div>
        <div
          className={`text-[14px] font-bold ${
            checked ? 'text-violet-800' : 'text-slate-700'
          }`}
        >
          {label}
        </div>
        {desc ? (
          <div className="mt-0.5 text-xs font-medium text-slate-400">{desc}</div>
        ) : null}
      </div>

      <span
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? 'bg-violet-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

function AccordionCard({ id, title, expandedSection, toggleSection, children }) {
  const isOpen = expandedSection === id;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
        isOpen
          ? 'border-violet-200 bg-white shadow-lg shadow-violet-100/40'
          : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => toggleSection(id)}
      >
        <span
          className={`text-[15px] font-black tracking-wide transition-colors ${
            isOpen ? 'text-violet-700' : 'text-slate-700'
          }`}
        >
          {title}
        </span>

        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            isOpen
              ? 'bg-violet-100 text-violet-600'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-slate-100 bg-slate-50/50 p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
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
  const [expandedSection, setExpandedSection] = useState('core');
  const [draft, setDraft] = useState(settings || {});
  const [showApiKey, setShowApiKey] = useState(false);

  const assistants = EXERCISE_ASSISTANTS;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setDraft(settings || {});
      setExpandedSection('core');
      setShowApiKey(false);
    }
  }, [open, settings]);

  const provider = getProviderById(draft?.providerId);
  const currentAssistant = getExerciseAssistantById(draft?.assistantId);

  const hasChanges = useMemo(() => {
    return JSON.stringify(draft || {}) !== JSON.stringify(settings || {});
  }, [draft, settings]);

  if (!mounted || !open) return null;

  const patchDraft = (patch) => {
    setDraft((prev) => ({
      ...prev,
      ...patch
    }));
  };

  const handleProviderChange = (providerId) => {
    const nextProvider = getProviderById(providerId);
    if (!nextProvider) return;

    const currentModel = draft?.model || '';
    const nextModels = nextProvider.models || [];
    const nextModel =
      nextProvider.allowCustomModel || nextModels.includes(currentModel)
        ? currentModel || getDefaultModelByProvider(providerId)
        : getDefaultModelByProvider(providerId);

    patchDraft({
      providerId,
      apiUrl: nextProvider.allowCustomApiUrl
        ? draft?.apiUrl || nextProvider.apiUrl || ''
        : nextProvider.apiUrl || '',
      model: nextModel
    });
  };

  const handleAssistantChange = (assistantId) => {
    const assistant = getExerciseAssistantById(assistantId);
    if (!assistant) return;

    patchDraft({
      assistantId,
      systemPrompt: assistant?.prompt || ''
    });
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleClose = () => {
    setDraft(settings || {});
    onClose?.();
  };

  const handleSave = () => {
    updateSettings?.(draft);
    onClose?.();
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483600]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-lg">
        <div className="max-h-[92vh] overflow-hidden rounded-t-[2rem] border border-white/30 bg-slate-100 shadow-2xl">
          <div className="pb-[max(12px,env(safe-area-inset-bottom))]">
            <div className="flex justify-center pt-2">
              <div className="h-1.5 w-10 rounded-full bg-slate-300" />
            </div>

            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-md">
              <div className="min-w-0">
                <div className="text-[18px] font-black text-slate-800">
                  AI 高级设置
                </div>
                <div className="mt-0.5 text-[12px] font-bold text-slate-400">
                  个性化配置模型、助手与语音偏好
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 active:scale-95"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="border-b border-slate-200 bg-white px-5 py-3">
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-500">
                  服务商：
                  <span className="ml-1 text-slate-700">
                    {provider?.name || '未设置'}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-500">
                  助手：
                  <span className="ml-1 text-slate-700">
                    {currentAssistant?.name || '未设置'}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-h-[calc(92vh-190px)] overflow-y-auto px-5 py-5 space-y-4 no-scrollbar">
              <AccordionCard
                id="core"
                title="1. 核心模型配置"
                expandedSection={expandedSection}
                toggleSection={toggleSection}
              >
                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    服务商
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {PROVIDERS.map((item) => (
                      <ChoiceButton
                        key={item.id}
                        active={draft?.providerId === item.id}
                        onClick={() => handleProviderChange(item.id)}
                        icon={item.icon}
                      >
                        {item.name}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                {provider?.allowCustomApiUrl ? (
                  <div>
                    <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                      接口地址
                    </div>
                    <input
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                      placeholder="例如 https://xxx.com/v1"
                      value={draft?.apiUrl || ''}
                      onChange={(e) => patchDraft({ apiUrl: e.target.value })}
                    />
                  </div>
                ) : null}

                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    模型选择
                  </div>

                  {provider?.allowCustomModel ? (
                    <input
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                      placeholder="输入模型名称"
                      value={draft?.model || ''}
                      onChange={(e) => patchDraft({ model: e.target.value })}
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {(provider?.models || []).map((model) => (
                        <ChoiceButton
                          key={model}
                          active={draft?.model === model}
                          onClick={() => patchDraft({ model })}
                        >
                          {model}
                        </ChoiceButton>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    API Key
                  </div>

                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      autoComplete="off"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-12 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                      placeholder="在此输入您的密钥"
                      value={draft?.apiKey || ''}
                      onChange={(e) => patchDraft({ apiKey: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showApiKey ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                </div>
              </AccordionCard>

              <AccordionCard
                id="assistant"
                title="2. 讲题助手与设定"
                expandedSection={expandedSection}
                toggleSection={toggleSection}
              >
                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    助手角色预设
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {assistants.map((assistant) => {
                      const isActive = draft?.assistantId === assistant.id;

                      return (
                        <button
                          key={assistant.id}
                          type="button"
                          onClick={() => handleAssistantChange(assistant.id)}
                          className={`group flex w-full items-center rounded-2xl border-2 p-3.5 text-left transition-all duration-200 active:scale-[0.99]
                            ${
                              isActive
                                ? 'border-violet-500 bg-violet-50/70 shadow-md shadow-violet-100/50'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <div
                            className={`mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300
                              ${
                                isActive
                                  ? 'bg-violet-200 text-violet-700 scale-105'
                                  : 'bg-slate-100 text-slate-500 group-hover:scale-105 group-hover:bg-slate-200'
                              }`}
                          >
                            {assistant.icon}
                          </div>

                          <div className="flex-1">
                            <div
                              className={`text-[15px] font-black transition-colors ${
                                isActive ? 'text-violet-800' : 'text-slate-700'
                              }`}
                            >
                              {assistant.name}
                            </div>
                            <div className="mt-0.5 text-[12px] font-bold text-slate-400">
                              选中后自动应用此人设规则
                            </div>
                          </div>

                          <div
                            className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                              ${
                                isActive
                                  ? 'border-violet-500 bg-violet-500'
                                  : 'border-slate-300 bg-transparent'
                              }`}
                          >
                            {isActive ? (
                              <FaCheck size={10} className="text-white" />
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      系统提示词 (微调)
                    </div>

                    <button
                      type="button"
                      className="rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-black text-violet-600 transition active:scale-95 hover:bg-violet-200"
                      onClick={() =>
                        patchDraft({
                          systemPrompt: currentAssistant?.prompt || ''
                        })
                      }
                    >
                      重置为默认
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    className="w-full resize-y rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold leading-relaxed text-slate-600 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                    placeholder="在此微调 AI 的行事规则..."
                    value={draft?.systemPrompt || ''}
                    onChange={(e) => patchDraft({ systemPrompt: e.target.value })}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      AI 发散温度 (Temperature)
                    </div>
                    <div className="flex w-10 items-center justify-center rounded-lg bg-violet-100 py-1 text-[12px] font-black text-violet-700">
                      {draft?.temperature ?? 0.2}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1.2"
                    step="0.05"
                    value={draft?.temperature ?? 0.2}
                    onChange={(e) =>
                      patchDraft({ temperature: Number(e.target.value) })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-500 transition-all hover:bg-slate-300 focus:outline-none"
                  />

                  <div className="mt-2 flex justify-between px-1 text-[10px] font-bold text-slate-400">
                    <span>精确保守 (0.0)</span>
                    <span>发散创造 (1.2)</span>
                  </div>
                </div>
              </AccordionCard>

              <AccordionCard
                id="voice"
                title="3. 语音引擎与触感反馈"
                expandedSection={expandedSection}
                toggleSection={toggleSection}
              >
                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    TTS 接口地址
                  </div>
                  <input
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                    placeholder="输入 TTS API URL"
                    value={draft?.ttsApiUrl || ''}
                    onChange={(e) => patchDraft({ ttsApiUrl: e.target.value })}
                  />
                </div>

                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    中文发音人选择
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {ZH_VOICE_OPTIONS.map((item) => (
                      <ChoiceButton
                        key={item.id}
                        active={draft?.zhVoice === item.id}
                        onClick={() => patchDraft({ zhVoice: item.id })}
                      >
                        {item.name}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    缅语发音人选择
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {MY_VOICE_OPTIONS.map((item) => (
                      <ChoiceButton
                        key={item.id}
                        active={draft?.myVoice === item.id}
                        onClick={() => patchDraft({ myVoice: item.id })}
                      >
                        {item.name}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <SwitchRow
                    label="设备震动反馈"
                    desc="交互时提供触感震动 (需设备支持)"
                    checked={!!draft?.vibration}
                    onChange={() =>
                      patchDraft({ vibration: !draft?.vibration })
                    }
                  />

                  <SwitchRow
                    label="应用内置音效"
                    desc="答对答错时播放提示音"
                    checked={!!draft?.soundFx}
                    onChange={() => patchDraft({ soundFx: !draft?.soundFx })}
                  />
                </div>
              </AccordionCard>
            </div>

            <div className="border-t border-slate-200 bg-white px-5 py-3">
              <div className="mb-3 text-center text-[11px] font-bold text-slate-400">
                {hasChanges ? '你有未保存的修改' : '当前没有未保存修改'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-12 rounded-2xl border border-slate-200 bg-white text-[14px] font-black text-slate-700 transition active:scale-[0.98]"
                >
                  取消
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className={`h-12 rounded-2xl text-[14px] font-black text-white transition active:scale-[0.98] ${
                    hasChanges
                      ? 'bg-violet-600 shadow-lg shadow-violet-200'
                      : 'bg-slate-300'
                  }`}
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

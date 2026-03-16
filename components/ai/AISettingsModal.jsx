import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
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
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
        }`}
    >
      {icon ? (
        <span className={`mr-2 text-lg ${active ? 'text-violet-600' : 'text-slate-400'}`}>
          {icon}
        </span>
      ) : null}

      <span className="relative z-10">{children}</span>

      {active ? (
        <div className="absolute right-3 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500">
          <FaCheck size={8} className="text-white" />
        </div>
      ) : null}
    </button>
  );
}

function SwitchRow({ label, checked, onChange, desc }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left transition-all active:scale-[0.99] ${
        checked
          ? 'border-violet-200 bg-violet-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <div>
        <div className={`text-[14px] font-bold ${checked ? 'text-violet-800' : 'text-slate-700'}`}>
          {label}
        </div>
        {desc ? <div className="mt-0.5 text-[11px] font-medium text-slate-400">{desc}</div> : null}
      </div>

      <div
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-violet-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}

function SubPage({ id, currentPage, onBack, title, children }) {
  const isActive = currentPage === id;
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e) => {
    if (!isActive) return;
    const x = e.touches[0].clientX;
    if (x > 40) return;
    startX.current = x;
    currentX.current = x;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const delta = Math.max(0, currentX.current - startX.current);
    setDragX(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const shouldGoBack = dragX > 100;
    setIsDragging(false);
    setDragX(0);

    if (shouldGoBack) {
      onBack?.();
    }
  };

  const transformValue = isActive
    ? isDragging
      ? `translateX(${dragX}px)`
      : 'translateX(0)'
    : 'translateX(100%)';

  const transitionClass = isDragging
    ? ''
    : 'transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]';

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col bg-slate-50 shadow-[-15px_0_30px_rgba(0,0,0,0.05)] ${transitionClass} ${
        isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ transform: transformValue, touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-2 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center text-slate-500 transition active:scale-95"
        >
          <FaChevronLeft size={16} />
        </button>

        <div className="text-[16px] font-black tracking-wide text-slate-800">{title}</div>

        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        {children}
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
  const [activePage, setActivePage] = useState('main');
  const [draft, setDraft] = useState({});
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setDraft(settings || {});
      setActivePage('main');
      setShowApiKey(false);
    }
  }, [open, settings]);

  if (!mounted || !open) return null;

  const provider = getProviderById(draft?.providerId);
  const currentAssistant = getExerciseAssistantById(draft?.assistantId);
  const zhVoiceName =
    ZH_VOICE_OPTIONS.find((v) => v.id === draft?.zhVoice)?.name || '未设置';
  const myVoiceName =
    MY_VOICE_OPTIONS.find((v) => v.id === draft?.myVoice)?.name || '未设置';

  const hasChanges =
    JSON.stringify(draft || {}) !== JSON.stringify(settings || {});

  const patchDraft = (patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleClose = () => {
    setDraft(settings || {});
    setActivePage('main');
    setShowApiKey(false);
    onClose?.();
  };

  const handleSave = () => {
    updateSettings?.(draft);
    onClose?.();
  };

  const handleProviderChange = (providerId) => {
    const nextProvider = getProviderById(providerId);
    if (!nextProvider) return;

    const currentModel = draft?.model || '';
    const validModels = nextProvider.models || [];
    const nextModel =
      nextProvider.allowCustomModel || validModels.includes(currentModel)
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
      systemPrompt: assistant.prompt || ''
    });
  };

  const MainMenuItem = ({ title, desc, icon, onClick, isLast }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between bg-white px-5 py-4 transition active:bg-slate-50 ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-[20px]">
          {icon}
        </div>
        <div className="flex flex-col items-start truncate">
          <span className="text-[15px] font-black text-slate-800">{title}</span>
          <span className="mt-1 max-w-[200px] truncate text-[12px] font-bold text-slate-400">
            {desc}
          </span>
        </div>
      </div>

      <FaChevronRight className="shrink-0 text-slate-300" size={14} />
    </button>
  );

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 999999 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative h-[85vh] w-full max-w-lg overflow-hidden rounded-t-3xl bg-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="relative h-full w-full overflow-hidden">
          <div
            className={`absolute inset-0 z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              activePage === 'main'
                ? 'translate-x-0 opacity-100 pointer-events-auto'
                : '-translate-x-[30%] opacity-50 pointer-events-none'
            }`}
          >
            <div className="shrink-0 bg-slate-100 pb-2">
              <div className="flex justify-center pb-2 pt-3">
                <div className="h-1.5 w-10 rounded-full bg-slate-300" />
              </div>

              <div className="flex items-center justify-between px-6 py-2">
                <div>
                  <div className="text-[20px] font-black text-slate-800">
                    高级设置
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold text-slate-400">
                    进行高度个性化的 AI 调整
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-500 transition active:scale-95"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <MainMenuItem
                  title="核心模型配置"
                  desc={`${provider?.name || '未知'} · ${draft?.model || '默认'}`}
                  icon="⚙️"
                  onClick={() => setActivePage('core')}
                />
                <MainMenuItem
                  title="讲题助手与设定"
                  desc={currentAssistant?.name || '未选定预设'}
                  icon="🤖"
                  onClick={() => setActivePage('assistant')}
                />
                <MainMenuItem
                  title="语音引擎与反馈"
                  desc={`${zhVoiceName} / ${myVoiceName}`}
                  icon="🔊"
                  isLast
                  onClick={() => setActivePage('voice')}
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <div className="mb-3 text-center text-[11px] font-bold text-slate-400">
                {hasChanges ? '有未保存的修改项' : '当前参数已是最新'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-12 rounded-2xl border-2 border-slate-200 bg-white text-[15px] font-black text-slate-700 transition active:scale-[0.98]"
                >
                  取消
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className={`h-12 rounded-2xl text-[15px] font-black text-white transition active:scale-[0.98] ${
                    hasChanges
                      ? 'bg-violet-600 shadow-lg shadow-violet-200'
                      : 'bg-slate-300'
                  }`}
                >
                  保存并应用
                </button>
              </div>
            </div>
          </div>

          <SubPage
            id="core"
            currentPage={activePage}
            onBack={() => setActivePage('main')}
            title="核心模型配置"
          >
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                服务商选择
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
                  自定义接口地址
                </div>
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-[14px] font-bold text-slate-700 outline-none focus:border-violet-500"
                  placeholder="如: https://api.openai.com/v1"
                  value={draft?.apiUrl || ''}
                  onChange={(e) => patchDraft({ apiUrl: e.target.value })}
                />
              </div>
            ) : null}

            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                模型标识符
              </div>

              {provider?.allowCustomModel ? (
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-[14px] font-bold text-slate-700 outline-none focus:border-violet-500"
                  placeholder="输入模型名称 (如: gpt-4o)"
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
                API Key 密钥
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 pr-12 text-[14px] font-bold text-slate-700 outline-none focus:border-violet-500"
                  placeholder="在此粘贴您的密钥"
                  value={draft?.apiKey || ''}
                  onChange={(e) => patchDraft({ apiKey: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"
                >
                  {showApiKey ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
          </SubPage>

          <SubPage
            id="assistant"
            currentPage={activePage}
            onBack={() => setActivePage('main')}
            title="讲题助手与设定"
          >
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                助手角色预设
              </div>

              <div className="grid grid-cols-1 gap-3">
                {EXERCISE_ASSISTANTS.map((assistant) => {
                  const isActive = draft?.assistantId === assistant.id;

                  return (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => handleAssistantChange(assistant.id)}
                      className={`group flex w-full items-center rounded-2xl border-2 p-3.5 text-left transition active:scale-[0.99] ${
                        isActive
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                          isActive ? 'bg-violet-200 text-violet-700' : 'bg-slate-100'
                        }`}
                      >
                        {assistant.icon}
                      </div>

                      <div className="flex-1">
                        <div
                          className={`text-[15px] font-black ${
                            isActive ? 'text-violet-800' : 'text-slate-700'
                          }`}
                        >
                          {assistant.name}
                        </div>
                        <div className="mt-0.5 text-[12px] font-bold text-slate-400">
                          选中后重置为专属提示词
                        </div>
                      </div>

                      {isActive ? (
                        <div className="ml-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500">
                          <FaCheck size={10} className="text-white" />
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  系统提示词 (进阶微调)
                </div>

                <button
                  type="button"
                  className="rounded-md bg-violet-100 px-2 py-1 text-[11px] font-black text-violet-600 active:bg-violet-200"
                  onClick={() =>
                    patchDraft({ systemPrompt: currentAssistant?.prompt || '' })
                  }
                >
                  重置为默认
                </button>
              </div>

              <textarea
                rows={6}
                className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-[13px] font-semibold leading-relaxed text-slate-600 outline-none focus:border-violet-500"
                placeholder="在此微调 AI 的行事规则..."
                value={draft?.systemPrompt || ''}
                onChange={(e) => patchDraft({ systemPrompt: e.target.value })}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  发散温度 Temperature
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
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-500"
              />
            </div>
          </SubPage>

          <SubPage
            id="voice"
            currentPage={activePage}
            onBack={() => setActivePage('main')}
            title="语音与反馈配置"
          >
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                TTS 接口基址
              </div>
              <input
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-[14px] font-bold text-slate-700 outline-none focus:border-violet-500"
                placeholder="文本转语音 API URL"
                value={draft?.ttsApiUrl || ''}
                onChange={(e) => patchDraft({ ttsApiUrl: e.target.value })}
              />
            </div>

            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                中文发音人
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
                缅语发音人
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
                desc="操作及交互时提供触感反馈"
                checked={!!draft?.vibration}
                onChange={() => patchDraft({ vibration: !draft?.vibration })}
              />
              <SwitchRow
                label="应用内置音效"
                desc="答题正确、错误时播放音效"
                checked={!!draft?.soundFx}
                onChange={() => patchDraft({ soundFx: !draft?.soundFx })}
              />
            </div>
          </SubPage>
        </div>
      </div>
    </div>,
    document.body
  );
}

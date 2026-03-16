import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import {
  PROVIDERS,
  EXERCISE_ASSISTANTS,
  getProviderById,
  getDefaultModelByProvider,
  getExerciseAssistantById
} from '../interactiveQuiz/interactiveSettings';

const ZH_VOICE_OPTIONS =[
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓 (女)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰 (男)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓标准' },
  { id: 'zh-CN-YunxiNeural', name: '云希' },
  { id: 'zh-CN-YunjianNeural', name: '云健' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊' }
];

const MY_VOICE_OPTIONS =[
  { id: 'my-MM-ThihaNeural', name: 'Thiha' },
  { id: 'my-MM-NilarNeural', name: 'Nilar' }
];

// 重构的选项按钮：更加现代化的未选中与选中态对比
function ChoiceButton({ active, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center justify-center rounded-xl border-2 px-3 py-3 text-[14px] font-bold transition-all duration-200 ease-out
        ${
          active
            ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_2px_10px_-3px_rgba(139,92,246,0.2)]' // 选中态
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50' // 待选态
        }`}
    >
      {icon && (
        <span className={`mr-2 text-lg transition-colors ${active ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>

      {/* 现代化的右侧 Check 指示器 */}
      <div
        className={`absolute right-3 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200 
          ${active ? 'scale-100 bg-violet-500 opacity-100' : 'scale-50 bg-transparent opacity-0'}`}
      >
        <FaCheck size={8} className="text-white" />
      </div>
    </button>
  );
}

// 优雅的 iOS 风格开关组件
function Switch({ label, checked, onChange, desc }) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3.5 transition-all duration-200 ${
        checked ? 'border-violet-200 bg-violet-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
      onClick={onChange}
    >
      <div>
        <div className={`text-[14px] font-bold ${checked ? 'text-violet-800' : 'text-slate-700'}`}>{label}</div>
        {desc && <div className="mt-0.5 text-xs font-medium text-slate-400">{desc}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-violet-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
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
  const[mounted, setMounted] = useState(false);
  const [expandedSection, setExpandedSection] = useState('core');

  const assistants = useMemo(() => EXERCISE_ASSISTANTS, [scene]);
  const provider = getProviderById(settings?.providerId);
  const currentAssistant = getExerciseAssistantById(settings?.assistantId);

  useEffect(() => {
    setMounted(true);
  },[]);

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

  // 卡片式的手风琴折叠面板容器
  const AccordionCard = ({ id, title, children }) => {
    const isOpen = expandedSection === id;
    return (
      <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${isOpen ? 'border-violet-200 bg-white shadow-lg shadow-violet-100/40' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'}`}>
        <div
          className="flex cursor-pointer select-none items-center justify-between px-5 py-4"
          onClick={() => toggleSection(id)}
        >
          <span className={`text-[15px] font-black tracking-wide transition-colors ${isOpen ? 'text-violet-700' : 'text-slate-700'}`}>
            {title}
          </span>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-400'}`}>
            {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </div>
        </div>
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483600] flex items-center justify-center p-4">
      {/* 背景蒙版 */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* 模态框主体 */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-white/30 bg-slate-100 shadow-2xl">
        {/* 顶部悬浮栏 */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div>
            <div className="text-[18px] font-black text-slate-800">AI 高级设置</div>
            <div className="mt-0.5 text-[12px] font-bold text-slate-400">
              个性化配置模型、助手与语音偏好
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 active:scale-95"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* 滚动区域 */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 no-scrollbar">
          
          {/* Section 1: 核心配置 */}
          <AccordionCard id="core" title="1. 核心模型配置">
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">服务商</div>
              <div className="grid grid-cols-2 gap-3">
                {PROVIDERS.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={settings?.providerId === item.id}
                    onClick={() => handleProviderChange(item.id)}
                    icon={item.icon}
                  >
                    {item.name}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {provider?.allowCustomApiUrl && (
              <div>
                <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">接口地址</div>
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                  placeholder="例如 https://xxx.com/v1"
                  value={settings?.apiUrl || ''}
                  onChange={(e) => updateSettings({ apiUrl: e.target.value })}
                />
              </div>
            )}

            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">模型选择</div>
              {provider?.allowCustomModel ? (
                <input
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                  placeholder="输入模型名称"
                  value={settings?.model || ''}
                  onChange={(e) => updateSettings({ model: e.target.value })}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(provider?.models ||[]).map((model) => (
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
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">API Key</div>
              <input
                type="password"
                autoComplete="off"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                placeholder="在此输入您的密钥"
                value={settings?.apiKey || ''}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
              />
            </div>
          </AccordionCard>

          {/* Section 2: 讲题助手 */}
          <AccordionCard id="assistant" title="2. 讲题助手与设定">
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">助手角色预设</div>
              <div className="grid grid-cols-1 gap-3">
                {assistants.map((assistant) => {
                  const isActive = settings?.assistantId === assistant.id;
                  return (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => handleAssistantChange(assistant.id)}
                      className={`group flex w-full items-center rounded-2xl border-2 p-3.5 text-left transition-all duration-200
                        ${isActive
                          ? 'border-violet-500 bg-violet-50/70 shadow-md shadow-violet-100/50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300
                        ${isActive ? 'bg-violet-200 text-violet-700 scale-105' : 'bg-slate-100 text-slate-500 group-hover:scale-105 group-hover:bg-slate-200'}`}>
                        {assistant.icon}
                      </div>
                      <div className="flex-1">
                        <div className={`text-[15px] font-black transition-colors ${isActive ? 'text-violet-800' : 'text-slate-700'}`}>
                          {assistant.name}
                        </div>
                        <div className="mt-0.5 text-[12px] font-bold text-slate-400">
                          选中后自动应用此人设规则
                        </div>
                      </div>
                      <div className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                        ${isActive ? 'border-violet-500 bg-violet-500' : 'border-slate-300 bg-transparent'}`}>
                        {isActive && <FaCheck size={10} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">系统提示词 (微调)</div>
                <button
                  type="button"
                  className="rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-black text-violet-600 transition active:scale-95 hover:bg-violet-200"
                  onClick={() => updateSettings({ systemPrompt: currentAssistant.prompt })}
                >
                  重置为默认
                </button>
              </div>
              <textarea
                rows={5}
                className="w-full resize-y rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold leading-relaxed text-slate-600 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                placeholder="在此微调 AI 的行事规则..."
                value={settings?.systemPrompt || ''}
                onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">AI 发散温度 (Temperature)</div>
                <div className="flex w-10 items-center justify-center rounded-lg bg-violet-100 py-1 text-[12px] font-black text-violet-700">
                  {settings?.temperature ?? 0.2}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.05"
                value={settings?.temperature ?? 0.2}
                onChange={(e) => updateSettings({ temperature: Number(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-500 transition-all hover:bg-slate-300 focus:outline-none"
              />
              <div className="mt-2 flex justify-between px-1 text-[10px] font-bold text-slate-400">
                <span>精确保守 (0.0)</span>
                <span>发散创造 (1.2)</span>
              </div>
            </div>
          </AccordionCard>

          {/* Section 3: 语音与反馈 */}
          <AccordionCard id="voice" title="3. 语音引擎与触感反馈">
            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">TTS 接口地址</div>
              <input
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[14px] font-bold text-slate-700 transition-all placeholder:text-slate-300 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                placeholder="输入 TTS API URL"
                value={settings?.ttsApiUrl || ''}
                onChange={(e) => updateSettings({ ttsApiUrl: e.target.value })}
              />
            </div>

            <div>
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">中文发音人选择</div>
              <div className="grid grid-cols-2 gap-3">
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
              <div className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">缅语发音人选择</div>
              <div className="grid grid-cols-2 gap-3">
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

            {/* 现代化的 Switch 开关区 */}
            <div className="flex flex-col gap-3 pt-2">
              <Switch
                label="设备震动反馈"
                desc="交互时提供触感震动 (需设备支持)"
                checked={!!settings?.vibration}
                onChange={() => updateSettings({ vibration: !settings?.vibration })}
              />
              <Switch
                label="应用内置音效"
                desc="答对答错时播放提示音"
                checked={!!settings?.soundFx}
                onChange={() => updateSettings({ soundFx: !settings?.soundFx })}
              />
            </div>
          </AccordionCard>

        </div>
      </div>
    </div>,
    document.body
  );
}

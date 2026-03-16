import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';
import {
  PROVIDERS,
  EXERCISE_ASSISTANTS,
  getProviderById,
  getDefaultModelByProvider,
  getExerciseAssistantById
} from '../interactiveQuiz/interactiveSettings';

// 漂亮的高对比度选择按钮
function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-2xl border-2 px-3 py-3.5 text-sm font-bold transition-all ${
        active
          ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 active:bg-slate-50'
      }`}
    >
      {children}
      {active && (
        <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] text-white shadow-sm">
          <FaCheckCircle />
        </div>
      )}
    </button>
  );
}

export default function AISettingsModal({ open, settings, updateSettings, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [expandedSection, setExpandedSection] = useState('core'); 

  const provider = getProviderById(settings?.providerId);
  const currentAssistant = getExerciseAssistantById(settings?.assistantId);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !open) return null;

  const handleProviderChange = (providerId) => {
    const nextProvider = getProviderById(providerId);
    updateSettings({
      providerId,
      apiUrl: nextProvider.allowCustomApiUrl ? settings?.apiUrl || '' : nextProvider.apiUrl,
      model: getDefaultModelByProvider(providerId)
    });
  };

  const AccordionHeader = ({ id, title, icon }) => (
    <div 
      className={`flex cursor-pointer items-center justify-between rounded-2xl px-4 py-4 transition-colors ${
        expandedSection === id ? 'bg-slate-100' : 'bg-slate-50 hover:bg-slate-100'
      }`}
      onClick={() => setExpandedSection(expandedSection === id ? null : id)}
    >
      <span className="flex items-center gap-2 font-black text-slate-700">
        {title}
      </span>
      {expandedSection === id ? <FaChevronUp size={12} className="text-slate-400" /> : <FaChevronDown size={12} className="text-slate-400" />}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="text-lg font-black text-slate-800">AI 设置</div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            <FaTimes size={16} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar space-y-4">
          
          {/* 1. 核心模型 */}
          <div className="space-y-3">
            <AccordionHeader id="core" title="核心模型配置" />
            {expandedSection === 'core' && (
              <div className="px-1 py-2 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase text-slate-400">选择服务商</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROVIDERS.map((item) => (
                      <ChoiceButton key={item.id} active={settings?.providerId === item.id} onClick={() => handleProviderChange(item.id)}>
                        <span className="mr-2">{item.icon}</span>{item.name}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
                {provider?.allowCustomApiUrl && (
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase text-slate-400">接口地址</label>
                    <input className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-500 focus:bg-white" 
                           placeholder="https://..." value={settings?.apiUrl || ''} onChange={(e) => updateSettings({ apiUrl: e.target.value })} />
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase text-slate-400">API KEY</label>
                  <input type="password" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-500 focus:bg-white" 
                         placeholder="输入您的密钥" value={settings?.apiKey || ''} onChange={(e) => updateSettings({ apiKey: e.target.value })} />
                </div>
              </div>
            )}
          </div>

          {/* 2. 讲题助手 */}
          <div className="space-y-3">
            <AccordionHeader id="assistant" title="讲题助手设定" />
            {expandedSection === 'assistant' && (
              <div className="px-1 py-2 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {EXERCISE_ASSISTANTS.map((as) => (
                    <button key={as.id} onClick={() => updateSettings({ assistantId: as.id, systemPrompt: as.prompt })}
                            className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                              settings?.assistantId === as.id ? 'border-violet-600 bg-violet-50' : 'border-slate-100 hover:border-slate-200'
                            }`}>
                      <span className="text-2xl">{as.icon}</span>
                      <div className="flex-1">
                        <div className={`font-black ${settings?.assistantId === as.id ? 'text-violet-700' : 'text-slate-700'}`}>{as.name}</div>
                        <div className="text-[11px] font-bold text-slate-400">点击切换此角色</div>
                      </div>
                      {settings?.assistantId === as.id && <FaCheckCircle className="text-violet-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. 语音反馈 */}
          <div className="space-y-3">
            <AccordionHeader id="voice" title="语音与反馈" />
            {expandedSection === 'voice' && (
              <div className="px-1 py-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateSettings({ vibration: !settings?.vibration })}
                          className={`rounded-2xl border-2 py-4 text-sm font-black transition-all ${
                            settings?.vibration ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500'
                          }`}>震动：{settings?.vibration ? 'ON' : 'OFF'}</button>
                  <button onClick={() => updateSettings({ soundFx: !settings?.soundFx })}
                          className={`rounded-2xl border-2 py-4 text-sm font-black transition-all ${
                            settings?.soundFx ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500'
                          }`}>音效：{settings?.soundFx ? 'ON' : 'OFF'}</button>
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

import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaChevronRight } from 'react-icons/fa';
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

// 可复用的右侧带箭头行
function ActionRow({ label, value, onClick }) {
  return (
    <div 
      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 mb-3 active:scale-[0.98] transition-transform cursor-pointer border border-slate-100"
      onClick={onClick}
    >
      <span className="font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold text-violet-600 max-w-[150px] truncate">{value}</span>
        <FaChevronRight className="text-slate-400 text-sm" />
      </div>
    </div>
  );
}

// 底部弹出选择器组件
function BottomSelector({ open, title, options, selectedValue, onSelect, onClose }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[2147483610] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_0.2s]" onClick={onClose} />
      <div className="relative w-full max-h-[70vh] bg-white rounded-t-3xl flex flex-col animate-[slideUp_0.2s_ease-out]">
        <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1.5 bg-slate-200 rounded-full" /></div>
        <div className="px-5 py-3 text-center font-black text-slate-800 text-lg border-b border-slate-100">{title}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => { onSelect(opt.id); onClose(); }}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition ${
                selectedValue === opt.id ? 'border-violet-500 bg-violet-50' : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}
            >
              <span className={`font-bold ${selectedValue === opt.id ? 'text-violet-700' : 'text-slate-700'}`}>
                {opt.icon && <span className="mr-2">{opt.icon}</span>}{opt.name}
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedValue === opt.id ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
              }`}>
                {selectedValue === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function AISettingsModal({ open, settings, updateSettings, onClose, scene = 'exercise' }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('model'); // 'model', 'assistant', 'voice'
  const [selectorState, setSelectorState] = useState({ open: false, type: '', title: '', options: [] });

  const assistants = useMemo(() => EXERCISE_ASSISTANTS, [scene]);
  const provider = getProviderById(settings?.providerId);
  const currentAssistant = getExerciseAssistantById(settings?.assistantId);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !open) return null;

  const handleProviderChange = (providerId) => {
    const nextProvider = getProviderById(providerId);
    const currentModel = settings?.model || '';
    const nextModel = (nextProvider.allowCustomModel || nextProvider.models.includes(currentModel))
        ? currentModel || getDefaultModelByProvider(providerId)
        : getDefaultModelByProvider(providerId);
    updateSettings({ providerId, apiUrl: nextProvider.allowCustomApiUrl ? settings?.apiUrl || '' : nextProvider.apiUrl, model: nextModel });
  };

  const openSelector = (type) => {
    let title = '', options = [];
    if (type === 'provider') {
      title = '选择服务商';
      options = PROVIDERS;
    } else if (type === 'model') {
      title = '选择模型';
      options = provider.models.map(m => ({ id: m, name: m }));
    } else if (type === 'assistant') {
      title = '选择讲题助手';
      options = assistants;
    } else if (type === 'zhVoice') {
      title = '选择中文发音人';
      options = ZH_VOICE_OPTIONS;
    } else if (type === 'myVoice') {
      title = '选择缅语发音人';
      options = MY_VOICE_OPTIONS;
    }
    setSelectorState({ open: true, type, title, options });
  };

  const handleSelectorSelect = (id) => {
    if (selectorState.type === 'provider') handleProviderChange(id);
    else if (selectorState.type === 'model') updateSettings({ model: id });
    else if (selectorState.type === 'assistant') {
      const ast = getExerciseAssistantById(id);
      updateSettings({ assistantId: id, systemPrompt: ast.prompt });
    }
    else if (selectorState.type === 'zhVoice') updateSettings({ zhVoice: id });
    else if (selectorState.type === 'myVoice') updateSettings({ myVoice: id });
  };

  // 获取显示的文本
  const getDisplayValue = (type) => {
    if (type === 'provider') return provider?.name || '未选择';
    if (type === 'model') return settings?.model || '未选择';
    if (type === 'assistant') return currentAssistant?.name || '未选择';
    if (type === 'zhVoice') return ZH_VOICE_OPTIONS.find(v => v.id === settings?.zhVoice)?.name || '晓晓 (女)';
    if (type === 'myVoice') return MY_VOICE_OPTIONS.find(v => v.id === settings?.myVoice)?.name || 'Thiha';
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483600] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.3s]" onClick={onClose} />

      <div className="relative w-full max-h-[90vh] bg-white rounded-t-3xl flex flex-col shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        {/* 拖拽指示器 & 头部 */}
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1.5 bg-slate-200 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="text-[18px] font-black text-slate-800 flex items-center gap-2">🤖 AI 设置</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">✕</button>
        </div>

        {/* 标签页导航 */}
        <div className="flex px-4 gap-2 mb-2">
          {[{ id: 'model', name: '模型' }, { id: 'assistant', name: '助手' }, { id: 'voice', name: '语音' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === tab.id ? 'bg-violet-100 text-violet-700' : 'bg-transparent text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-6">
          {/* TAB 1: 模型 */}
          {activeTab === 'model' && (
            <div className="space-y-4 animate-[fadeIn_0.2s]">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">服务商配置</div>
                <ActionRow label="服务商" value={getDisplayValue('provider')} onClick={() => openSelector('provider')} />
                {provider?.allowCustomModel ? (
                  <div className="mb-3">
                    <div className="text-xs font-bold text-slate-400 mb-2 ml-1">自定义模型名称</div>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white" value={settings?.model || ''} onChange={(e) => updateSettings({ model: e.target.value })} placeholder="输入模型名..." />
                  </div>
                ) : (
                  <ActionRow label="模型" value={getDisplayValue('model')} onClick={() => openSelector('model')} />
                )}
              </div>

              {provider?.allowCustomApiUrl && (
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-2 ml-1">接口地址</div>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white" value={settings?.apiUrl || ''} onChange={(e) => updateSettings({ apiUrl: e.target.value })} placeholder="https://..." />
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">API Key</div>
                <input type="password" placeholder="sk-..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white" value={settings?.apiKey || ''} onChange={(e) => updateSettings({ apiKey: e.target.value })} />
              </div>
            </div>
          )}

          {/* TAB 2: 助手 */}
          {activeTab === 'assistant' && (
            <div className="space-y-4 animate-[fadeIn_0.2s]">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">讲题助手角色</div>
                <ActionRow label="当前助手" value={getDisplayValue('assistant')} onClick={() => openSelector('assistant')} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 mx-1">
                  <div className="text-xs font-bold text-slate-400">系统提示词 (微调)</div>
                  <button onClick={() => updateSettings({ systemPrompt: currentAssistant.prompt })} className="text-xs font-bold text-violet-600">重置</button>
                </div>
                <textarea rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 text-sm outline-none focus:border-violet-400 focus:bg-white leading-relaxed resize-none" placeholder="修改助手人设..." value={settings?.systemPrompt || ''} onChange={(e) => updateSettings({ systemPrompt: e.target.value })} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 mx-1">
                  <div className="text-xs font-bold text-slate-400">AI 发散温度</div>
                  <div className="text-sm font-black text-violet-600">{settings?.temperature ?? 0.2}</div>
                </div>
                <input type="range" min="0" max="1.2" step="0.05" value={settings?.temperature ?? 0.2} onChange={(e) => updateSettings({ temperature: Number(e.target.value) })} className="w-full accent-violet-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1 font-bold">
                  <span>更严谨</span><span>更发散</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 语音 */}
          {activeTab === 'voice' && (
            <div className="space-y-4 animate-[fadeIn_0.2s]">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">发音人选择</div>
                <ActionRow label="中文发音人" value={getDisplayValue('zhVoice')} onClick={() => openSelector('zhVoice')} />
                <ActionRow label="缅语发音人" value={getDisplayValue('myVoice')} onClick={() => openSelector('myVoice')} />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">TTS 接口</div>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-700 outline-none focus:border-violet-400 focus:bg-white" value={settings?.ttsApiUrl || ''} onChange={(e) => updateSettings({ ttsApiUrl: e.target.value })} />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 ml-1">互动反馈</div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateSettings({ vibration: !settings?.vibration })} className={`py-4 rounded-2xl font-bold border-2 transition ${settings?.vibration ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                    手机震动: {settings?.vibration ? 'ON' : 'OFF'}
                  </button>
                  <button onClick={() => updateSettings({ soundFx: !settings?.soundFx })} className={`py-4 rounded-2xl font-bold border-2 transition ${settings?.soundFx ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                    按键音效: {settings?.soundFx ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="px-5 pt-2 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-slate-100 bg-white">
          <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-transform">
            完成
          </button>
        </div>
      </div>

      {/* 底部选择器组件 */}
      <BottomSelector
        open={selectorState.open} title={selectorState.title} options={selectorState.options}
        selectedValue={
          selectorState.type === 'provider' ? settings?.providerId :
          selectorState.type === 'model' ? settings?.model :
          selectorState.type === 'assistant' ? settings?.assistantId :
          selectorState.type === 'zhVoice' ? settings?.zhVoice : settings?.myVoice
        }
        onSelect={handleSelectorSelect} onClose={() => setSelectorState(s => ({ ...s, open: false }))}
      />
    </div>,
    document.body
  );
}

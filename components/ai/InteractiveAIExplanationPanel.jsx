import React from 'react';
import { FaRobot, FaSpinner, FaVolumeUp, FaTimes, FaRedo } from 'react-icons/fa';

export default function InteractiveAIExplanationPanel({
  open,
  loading,
  text,
  error,
  title = 'AI 解析',
  onClose,
  onReplay,
  onRetry
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-t-[28px] shadow-2xl border-t border-slate-200 animate-[slideUp_.22s_ease-out]">
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
              <FaRobot size={18} />
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-800">{title}</div>
              <div className="text-[11px] text-slate-400 font-bold">帮助你理解为什么对 / 为什么错</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="px-5 py-5 min-h-[180px] max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <FaSpinner className="animate-spin mb-3" size={22} />
              <div className="text-sm font-bold">AI 正在解释...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl p-4 text-sm font-bold">
              {error}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
              {text || '暂时还没有解析内容。'}
            </div>
          )}
        </div>

        <div className="px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 flex gap-3">
          <button
            onClick={onReplay}
            disabled={!text || loading}
            className={`flex-1 h-12 rounded-2xl font-black flex items-center justify-center gap-2 ${
              !text || loading
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            <FaVolumeUp size={15} />
            朗读
          </button>

          <button
            onClick={onRetry}
            disabled={loading}
            className={`flex-1 h-12 rounded-2xl font-black flex items-center justify-center gap-2 ${
              loading
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-violet-500 text-white'
            }`}
          >
            <FaRedo size={14} />
            重新解释
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(32px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

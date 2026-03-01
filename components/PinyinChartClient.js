"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
    PlayCircle, PauseCircle, ChevronsLeft, ChevronsRight, 
    Volume2, Mic, Square, Ear, RefreshCcw, Loader2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. IndexedDB 离线缓存管理器 (保持原样，非常优秀)
// ==========================================
const DB_NAME = 'Pinyin_Hsk_Audio_DB';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;

const AudioCacheManager = {
    db: null,
    async init() {
        if (typeof window === 'undefined') return;
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
            };
            request.onsuccess = (event) => { this.db = event.target.result; resolve(this.db); };
            request.onerror = (event) => reject(event.target.error);
        });
    },
    async getAudioUrl(url) {
        if (!url) return null;
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(url);
            request.onsuccess = () => {
                if (request.result) resolve(URL.createObjectURL(request.result));
                else resolve(null);
            };
            request.onerror = () => reject(request.error);
        });
    },
    async cacheAudio(url, blob) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(blob, url);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};

// ==========================================
// 2. 视觉组件 (移动端专项优化)
// ==========================================

const SiriWaveform = ({ isActive }) => (
    <div className="flex items-center justify-center gap-1 h-6">
        {[...Array(4)].map((_, i) => (
            <motion.div
                key={i}
                animate={isActive ? { height: [4, 12 + Math.random() * 8, 4], backgroundColor: ["#8b5cf6", "#ec4899", "#8b5cf6"] } : { height: 4, backgroundColor: "#cbd5e1" }}
                transition={isActive ? { repeat: Infinity, duration: 0.4 + Math.random() * 0.2, ease: "easeInOut" } : { duration: 0.3 }}
                className="w-1.5 rounded-full bg-slate-300"
            />
        ))}
    </div>
);

const LetterButton = React.memo(({ item, isActive, isSelected, onClick }) => {
    // 动态字号计算
    const fontSizeClass = useMemo(() => {
        const len = item.letter.length;
        if (len >= 5) return 'text-lg sm:text-xl';
        if (len === 4) return 'text-xl sm:text-2xl';
        if (len === 3) return 'text-2xl sm:text-3xl';
        return 'text-3xl sm:text-4xl';
    }, [item.letter]);

    return (
        <motion.button
            onClick={() => onClick(item)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.92 }}
            className={`group relative w-full aspect-[5/4] flex flex-col items-center justify-center rounded-2xl transition-all duration-300 select-none overflow-hidden touch-manipulation
            ${isActive 
                ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30 ring-2 ring-violet-300/50' 
                : isSelected
                    ? 'bg-white border-2 border-violet-400 shadow-sm ring-4 ring-violet-50' 
                    : 'bg-white border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] active:shadow-none'
            }`}
        >
            <span className={`font-black tracking-tight leading-none z-10 transition-colors duration-200
                ${fontSizeClass}
                ${isActive ? 'text-white drop-shadow-sm' : 'text-slate-700'}
            `}>
                {item.letter}
            </span>
            
            {/* 极简指示器 */}
            {item.audio && (
                <div className="absolute bottom-2 h-1 w-1 rounded-full transition-colors duration-300">
                    <motion.div 
                        animate={isActive ? { scale: [1, 2, 1], opacity: 1 } : { scale: 1, opacity: 0 }}
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`}
                    />
                </div>
            )}
        </motion.button>
    );
}, (prev, next) => prev.item.letter === next.item.letter && prev.isActive === next.isActive && prev.isSelected === next.isSelected);
LetterButton.displayName = 'LetterButton';

// ==========================================
// 3. 主组件
// ==========================================

export default function PinyinChartClient({ initialData }) {
    const [currentIndex, setCurrentIndex] = useState({ cat: 0, row: 0, col: 0 });
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isPlayingLetter, setIsPlayingLetter] = useState(null); 
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false); 

    const [isRecording, setIsRecording] = useState(false);
    const [isMicLoading, setIsMicLoading] = useState(false);
    const [userAudioUrl, setUserAudioUrl] = useState(null);
    const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);

    const audioRef = useRef(null); 
    const userAudioRef = useRef(null); 
    const timeoutRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => { AudioCacheManager.init().catch(console.error); }, []);

    const playAudio = useCallback(async (item, isAuto = false) => {
        if (!item?.audio) { if (isAuto) handleAudioEnd(); return; }
        if (!isAuto && isAutoPlaying) setIsAutoPlaying(false);

        setSelectedItem(item);
        if (selectedItem?.letter !== item.letter) setUserAudioUrl(null);
        if (typeof window === "undefined" || !audioRef.current) return;

        try {
            setIsLoadingAudio(true);
            setIsPlayingLetter(item.letter); 

            let srcToPlay = await AudioCacheManager.getAudioUrl(item.audio);
            if (!srcToPlay) {
                const response = await fetch(item.audio);
                const blob = await response.blob();
                await AudioCacheManager.cacheAudio(item.audio, blob);
                srcToPlay = URL.createObjectURL(blob);
            }

            audioRef.current.src = srcToPlay;
            audioRef.current.playbackRate = playbackRate;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback interrupted:", error);
                    setIsPlayingLetter(null);
                    if (isAuto) handleAudioEnd();
                });
            }
        } catch (e) {
            setIsPlayingLetter(null);
        } finally {
            setIsLoadingAudio(false);
        }
    }, [isAutoPlaying, playbackRate, selectedItem]);

    const handleAudioEnd = useCallback(() => {
        setIsPlayingLetter(null);
        if (isAutoPlaying) {
            timeoutRef.current = setTimeout(() => {
                let nextIndex;
                if (initialData.categories) {
                    const currentCat = initialData.categories[currentIndex.cat];
                    const currentRow = currentCat.rows[currentIndex.row];
                    if (currentIndex.col < currentRow.length - 1) nextIndex = { ...currentIndex, col: currentIndex.col + 1 };
                    else if (currentIndex.row < currentCat.rows.length - 1) nextIndex = { ...currentIndex, row: currentIndex.row + 1, col: 0 };
                    else if (currentIndex.cat < initialData.categories.length - 1) nextIndex = { cat: currentIndex.cat + 1, row: 0, col: 0 };
                    else { setIsAutoPlaying(false); return; }
                } else {
                    if (currentIndex.col < initialData.items.length - 1) nextIndex = { ...currentIndex, col: currentIndex.col + 1 };
                    else { setIsAutoPlaying(false); return; }
                }
                setCurrentIndex(nextIndex);
            }, 400); 
        }
    }, [isAutoPlaying, currentIndex, initialData]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        let item = initialData.categories 
            ? initialData.categories[currentIndex.cat]?.rows[currentIndex.row]?.[currentIndex.col] 
            : initialData.items[currentIndex.col];
        if (item) playAudio(item, true);
        else setIsAutoPlaying(false);
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [currentIndex, isAutoPlaying, playAudio, initialData]);

    const toggleAutoPlay = useCallback(() => {
        if (isAutoPlaying) {
            setIsAutoPlaying(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
            setIsPlayingLetter(null);
        } else {
            setCurrentIndex({ cat: 0, row: 0, col: 0 });
            setIsAutoPlaying(true);
        }
    }, [isAutoPlaying]);

    // 录音逻辑保持不变
    const startRecording = async () => {
        if (typeof window === "undefined") return;
        setIsMicLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setUserAudioUrl(URL.createObjectURL(audioBlob));
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start(100);
            setIsRecording(true);
        } catch (error) {
            alert("请允许麦克风权限以使用对比功能。");
        } finally { setIsMicLoading(false); }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    const playUserAudio = () => {
        if (userAudioUrl && userAudioRef.current) {
            userAudioRef.current.src = userAudioUrl;
            userAudioRef.current.play();
            setIsPlayingUserAudio(true);
            userAudioRef.current.onended = () => setIsPlayingUserAudio(false);
        }
    };

    return (
        <>
            <style jsx global>{`
                /* 深度定制美观的 iOS 风格滑动条 */
                input[type=range] { -webkit-appearance: none; background: transparent; width: 100%; }
                input[type=range]:focus { outline: none; }
                input[type=range]::-webkit-slider-thumb { 
                    -webkit-appearance: none; height: 20px; width: 20px; 
                    border-radius: 50%; background: #fff; 
                    cursor: pointer; margin-top: -8px; 
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05); 
                }
                input[type=range]::-webkit-slider-runnable-track { 
                    width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; 
                }
            `}</style>

            <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 relative font-sans">
                {/* 轻量级背景光晕，不卡顿 */}
                <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-violet-100/40 to-transparent pointer-events-none" />

                <div className="max-w-3xl mx-auto p-3 sm:p-5 relative z-10 flex flex-col min-h-screen">
                    <audio ref={audioRef} onEnded={handleAudioEnd} preload="none" />
                    <audio ref={userAudioRef} />
                    
                    {/* 主图表区：增加底部 padding 防止被控制台遮挡 */}
                    <main className="flex-grow flex flex-col pb-48 w-full">
                        {initialData.categories ? (
                            <div className="space-y-6">
                                {initialData.categories.map((cat, catIdx) => (
                                    <div key={cat.name} className="space-y-2">
                                        {cat.rows.map((row, rowIndex) => (
                                            <div key={rowIndex} className="grid grid-cols-4 gap-2 sm:gap-3">
                                                {row.map(item => (
                                                    <LetterButton key={item.letter} item={item} isActive={isPlayingLetter === item.letter} isSelected={selectedItem?.letter === item.letter} onClick={playAudio} />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                                {initialData.items.map(item => (
                                    <LetterButton key={item.letter} item={item} isActive={isPlayingLetter === item.letter} isSelected={selectedItem?.letter === item.letter} onClick={playAudio} />
                                ))}
                            </div>
                        )}
                    </main>
                    
                    {/* 移动端沉浸式悬浮控制坞 (Floating Dock) */}
                    <div className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-50 max-w-2xl mx-auto touch-none pb-[env(safe-area-inset-bottom)]">
                        <motion.div layout className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
                            
                            {/* 跟读面板：只有选中时才平滑展开 */}
                            <AnimatePresence mode="popLayout">
                                {selectedItem && !isAutoPlaying && (
                                    <motion.div 
                                        key="recorder"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-slate-50/50 border-b border-slate-100/60"
                                    >
                                        <div className="p-4 flex items-center justify-between gap-3">
                                            {/* 左侧：目标发音 */}
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
                                                <span className="text-3xl font-black text-slate-800">{selectedItem.letter}</span>
                                                <button onClick={() => playAudio(selectedItem)} className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-100 text-violet-600 active:bg-violet-200">
                                                    <Volume2 size={16} />
                                                </button>
                                            </div>

                                            {/* 右侧：录音交互区 */}
                                            <div className="flex items-center justify-end gap-2 flex-1">
                                                {isRecording && <SiriWaveform isActive={true} />}
                                                
                                                {/* 用户录音回放 */}
                                                <AnimatePresence>
                                                    {userAudioUrl && !isRecording && !isMicLoading && (
                                                        <motion.button
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                            onClick={playUserAudio}
                                                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                                                                isPlayingUserAudio ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                            }`}
                                                        >
                                                            {isPlayingUserAudio ? <Volume2 size={16} className="animate-pulse"/> : <CheckCircle2 size={18} />}
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>

                                                {/* 核心录音按钮 */}
                                                <button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    disabled={isMicLoading}
                                                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-md 
                                                    ${isRecording 
                                                        ? 'bg-rose-500 text-white shadow-rose-500/40 scale-105' 
                                                        : isMicLoading
                                                            ? 'bg-slate-100 text-slate-400'
                                                            : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                                                >
                                                    {isMicLoading ? <Loader2 size={18} className="animate-spin" /> : isRecording ? <Square size={16} fill="currentColor" className="rounded-sm" /> : <Mic size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 底部常规控制栏 */}
                            <div className="p-4 flex flex-col gap-4">
                                {/* 语速条 */}
                                <div className="flex items-center gap-3 px-2">
                                    <span className="text-[10px] font-bold text-slate-400">语速</span>
                                    <div className="flex-1 relative flex items-center">
                                        <input
                                            type="range" min="0.5" max="2.0" step="0.1"
                                            value={playbackRate}
                                            onChange={(e) => setPlaybackRate(Number(e.target.value))}
                                        />
                                        <div className="absolute left-0 h-1 bg-violet-400 rounded-full pointer-events-none" style={{ width: `${((playbackRate - 0.5) / 1.5) * 100}%` }} />
                                    </div>
                                    <span className="w-8 text-right text-xs font-bold text-slate-600">{playbackRate.toFixed(1)}x</span>
                                </div>

                                {/* 自动播放大按钮 */}
                                <button 
                                    onClick={toggleAutoPlay} 
                                    className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                                    ${isAutoPlaying 
                                        ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                                        : 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                                    }`}
                                >
                                    {isAutoPlaying ? (
                                        <><PauseCircle size={18} className="animate-pulse" />停止自动连播</>
                                    ) : (
                                        <><PlayCircle size={18} />全表自动连播</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

// components/HanziModal.js
// 手机优先增强版：
// ✅ 点击空白处关闭
// ✅ 去掉 ESC 监听
// ✅ 多字顺序动画
// ✅ 点击单字重播
// ✅ 描红练习（Quiz）
// ✅ 一键清屏重练
// ✅ 自动逐字发音（可开关）
// ✅ 震动反馈（支持设备）
// ✅ 防止背景滚动

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { pinyin as pinyinConverter } from 'pinyin-pro';

const getCellSize = (count) => {
  if (count <= 1) return 180;
  if (count === 2) return 155;
  if (count === 3) return 135;
  if (count === 4) return 118;
  if (count <= 6) return 104;
  return 92;
};

const speakChar = (char, enabled = true) => {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(char);
    u.lang = 'zh-CN';
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch (_) {}
};

const vibrate = (ms = 20) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
};

const HanziModal = ({ word = '', onClose }) => {
  const chars = useMemo(() => [...(word || '')], [word]);
  const count = chars.length;
  const cellSize = useMemo(() => getCellSize(count), [count]);

  const containerRefs = useRef([]);
  const writersRef = useRef([]);
  const cancelledRef = useRef(false);

  const [quizMode, setQuizMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speed, setSpeed] = useState(1); // 0.6 ~ 2
  const [showPinyin, setShowPinyin] = useState(true);

  const styles = useMemo(() => ({
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.62)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 12,
    },
    modal: {
      background: '#fff',
      width: '100%',
      maxWidth: 760,
      maxHeight: '92vh',
      overflowY: 'auto',
      borderRadius: 16,
      padding: 16,
      boxSizing: 'border-box',
    },
    title: {
      margin: 0,
      textAlign: 'center',
      color: '#0f172a',
      fontSize: '1.1rem',
      fontWeight: 800,
    },
    pinyinRow: {
      marginTop: 6,
      textAlign: 'center',
      color: '#7c3aed',
      fontWeight: 700,
      letterSpacing: '1px',
      fontSize: '0.92rem',
      minHeight: 20,
    },
    toolRow: {
      marginTop: 10,
      display: 'flex',
      gap: 8,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      border: '1px solid #e2e8f0',
      borderRadius: 99,
      padding: '6px 10px',
      fontSize: '0.82rem',
      background: '#f8fafc',
      color: '#334155',
      cursor: 'pointer',
      fontWeight: 700,
    },
    grid: {
      marginTop: 12,
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${cellSize}px, ${cellSize}px))`,
      justifyContent: 'center',
      gap: 10,
    },
    box: {
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: 4,
      background: '#fff',
      boxSizing: 'border-box',
      transition: 'all .2s',
      cursor: 'pointer',
    },
    boxActive: {
      border: '2px solid #3b82f6',
      boxShadow: '0 0 0 3px rgba(59,130,246,.16)',
    },
    target: {
      width: cellSize - 8,
      height: cellSize - 8,
      borderRadius: 8,
      background: '#fff',
    },
    footer: {
      marginTop: 14,
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 10,
    },
    btn: {
      border: 'none',
      borderRadius: 12,
      padding: '10px 14px',
      fontWeight: 800,
      cursor: 'pointer',
      background: '#eef2ff',
      color: '#0f172a',
    },
    btnPrimary: {
      background: '#2563eb',
      color: '#fff',
    },
    speedWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
    },
    speedInput: { width: 120 },
  }), [cellSize]);

  const stopFlow = useCallback(() => {
    cancelledRef.current = true;
    setActiveIndex(-1);
  }, []);

  const ensureWriters = useCallback(() => {
    containerRefs.current = containerRefs.current.slice(0, count);
    writersRef.current = writersRef.current.slice(0, count);

    chars.forEach((char, i) => {
      const el = containerRefs.current[i];
      if (!el) return;

      if (writersRef.current[i]) return;

      el.innerHTML = '';
      writersRef.current[i] = HanziWriter.create(el, char, {
        width: cellSize - 8,
        height: cellSize - 8,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: speed,
        delayBetweenStrokes: 100,
      });
    });
  }, [chars, count, cellSize, speed]);

  const resetWritersCanvas = useCallback(() => {
    ensureWriters();
    writersRef.current.forEach((w) => {
      if (!w) return;
      // 先清空，再显示轮廓
      w.hideCharacter();
      w.showOutline();
    });
  }, [ensureWriters]);

  const replayAll = useCallback(async () => {
    if (!count) return;
    stopFlow();
    cancelledRef.current = false;
    setQuizMode(false);

    ensureWriters();

    for (let i = 0; i < count; i++) {
      if (cancelledRef.current) break;
      const writer = writersRef.current[i];
      if (!writer) continue;

      setActiveIndex(i);
      vibrate(15);
      speakChar(chars[i], autoSpeak);

      await writer.animateCharacter({
        strokeAnimationSpeed: speed,
        delayBetweenStrokes: 100,
      });

      if (cancelledRef.current) break;
      await new Promise((r) => setTimeout(r, 180));
    }

    setActiveIndex(-1);
  }, [count, ensureWriters, stopFlow, chars, autoSpeak, speed]);

  const replayOne = useCallback(async (index) => {
    stopFlow();
    cancelledRef.current = false;
    setQuizMode(false);

    ensureWriters();
    const writer = writersRef.current[index];
    if (!writer) return;

    setActiveIndex(index);
    vibrate(12);
    speakChar(chars[index], autoSpeak);

    await writer.animateCharacter({
      strokeAnimationSpeed: speed,
      delayBetweenStrokes: 100,
    });
    setActiveIndex(-1);
  }, [ensureWriters, stopFlow, chars, autoSpeak, speed]);

  const startQuiz = useCallback(() => {
    stopFlow();
    cancelledRef.current = false;
    ensureWriters();
    setQuizMode(true);

    writersRef.current.forEach((w) => {
      if (!w) return;
      w.quiz({
        onComplete: () => vibrate(20),
      });
    });
  }, [ensureWriters, stopFlow]);

  const exitQuiz = useCallback(() => {
    setQuizMode(false);
    replayAll();
  }, [replayAll]);

  // 首次自动播放
  useEffect(() => {
    const t = setTimeout(() => replayAll(), 120);
    return () => clearTimeout(t);
  }, [replayAll]);

  // 速度变化后，更新 writer（重建最稳）
  useEffect(() => {
    // 清掉实例，等待下次 ensureWriters 重建
    writersRef.current = [];
    const t = setTimeout(() => replayAll(), 50);
    return () => clearTimeout(t);
  }, [speed, replayAll]);

  // 禁止背景滚动 + 清理
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = oldOverflow;
      stopFlow();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      containerRefs.current.forEach((el) => {
        if (el) el.innerHTML = '';
      });
      writersRef.current = [];
    };
  }, [stopFlow]);

  const pinyinText = useMemo(() => {
    if (!showPinyin) return '';
    try {
      return pinyinConverter(word, { toneType: 'symbol', separator: ' ' }).replace(/·/g, ' ');
    } catch {
      return '';
    }
  }, [word, showPinyin]);

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>汉字笔顺：{word}</h3>
        <div style={styles.pinyinRow}>{pinyinText}</div>

        <div style={styles.toolRow}>
          <button style={styles.chip} onClick={() => setAutoSpeak((v) => !v)}>
            逐字发音：{autoSpeak ? '开' : '关'}
          </button>
          <button style={styles.chip} onClick={() => setShowPinyin((v) => !v)}>
            拼音：{showPinyin ? '显示' : '隐藏'}
          </button>

          <div style={styles.speedWrap}>
            <span style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>速度</span>
            <input
              style={styles.speedInput}
              type="range"
              min="0.6"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span style={{ fontSize: 12, width: 30, textAlign: 'right', color: '#334155' }}>
              {speed.toFixed(1)}x
            </span>
          </div>
        </div>

        <div style={styles.grid}>
          {chars.map((char, index) => {
            const active = activeIndex === index;
            return (
              <char               .box, ?Active {})                onClick={() => replayOne(index)}
                title={`重播：${char}`}
              >
                <div
                  ref={(el) => {
                    containerRefs.current[index] = el;
                  }}
                  style={styles.target}
                />
              </div>
            );
          })}
        </div>

        <div style={styles.footer}>
          <button style={styles.btn} onClick={replayAll}>重播全部</button>
          <button style={styles.btn} onClick={resetWritersCanvas}>清屏重练</button>

          {!quizMode ? (
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={startQuiz}>
              开始描红
            </button>
          ) : (
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={exitQuiz}>
              退出描红
            </button>
          )}

          <button style={styles.btn} onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

export default HanziModal;

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
    window.speechSynthesis.speak(u);
  } catch (_) {}
};

const HanziModal = ({ word = '', onClose }) => {
  const chars = useMemo(() => [...(word || '')], [word]);
  const cellSize = useMemo(() => getCellSize(chars.length), [chars.length]);

  const containerRefs = useRef([]);
  const writersRef = useRef([]);
  const cancelledRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showPinyin, setShowPinyin] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [quizMode, setQuizMode] = useState(false);

  const styles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,23,42,0.62)',
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
    title: { margin: 0, textAlign: 'center', color: '#0f172a', fontWeight: 800 },
    pinyin: { textAlign: 'center', color: '#7c3aed', marginTop: 6, minHeight: 20, fontWeight: 700 },
    tools: { marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
    chip: {
      border: '1px solid #e2e8f0',
      borderRadius: 99,
      padding: '6px 10px',
      fontSize: 12,
      background: '#f8fafc',
      cursor: 'pointer',
      fontWeight: 700,
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
      cursor: 'pointer',
    },
    boxActive: {
      border: '2px solid #3b82f6',
      boxShadow: '0 0 0 3px rgba(59,130,246,.16)',
    },
    target: { width: cellSize - 8, height: cellSize - 8, borderRadius: 8 },
    footer: { marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' },
    btn: {
      border: 'none',
      borderRadius: 12,
      padding: '10px 14px',
      fontWeight: 800,
      cursor: 'pointer',
      background: '#eef2ff',
      color: '#0f172a',
    },
    btnPrimary: { background: '#2563eb', color: '#fff' },
  };

  const ensureWriters = useCallback(() => {
    containerRefs.current = containerRefs.current.slice(0, chars.length);
    writersRef.current = writersRef.current.slice(0, chars.length);

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
        delayBetweenStrokes: 120,
      });
    });
  }, [chars, cellSize, speed]);

  const replayAll = useCallback(async () => {
    cancelledRef.current = false;
    setQuizMode(false);
    ensureWriters();

    for (let i = 0; i < chars.length; i++) {
      if (cancelledRef.current) break;
      const w = writersRef.current[i];
      if (!w) continue;
      setActiveIndex(i);
      speakChar(chars[i], autoSpeak);
      await w.animateCharacter({ strokeAnimationSpeed: speed, delayBetweenStrokes: 120 });
      await new Promise((r) => setTimeout(r, 180));
    }
    setActiveIndex(-1);
  }, [chars, ensureWriters, autoSpeak, speed]);

  const replayOne = useCallback(
    async (index) => {
      cancelledRef.current = false;
      setQuizMode(false);
      ensureWriters();
      const w = writersRef.current[index];
      if (!w) return;
      setActiveIndex(index);
      speakChar(chars[index], autoSpeak);
      await w.animateCharacter({ strokeAnimationSpeed: speed, delayBetweenStrokes: 120 });
      setActiveIndex(-1);
    },
    [chars, ensureWriters, autoSpeak, speed]
  );

  const clearAndPractice = useCallback(() => {
    ensureWriters();
    writersRef.current.forEach((w) => {
      if (!w) return;
      w.hideCharacter();
      w.showOutline();
    });
  }, [ensureWriters]);

  const startQuiz = useCallback(() => {
    ensureWriters();
    setQuizMode(true);
    writersRef.current.forEach((w) => {
      if (!w) return;
      w.quiz();
    });
  }, [ensureWriters]);

  useEffect(() => {
    const t = setTimeout(() => replayAll(), 120);
    return () => clearTimeout(t);
  }, [replayAll]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelledRef.current = true;
      document.body.style.overflow = old;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
        <div style={styles.pinyin}>{pinyinText}</div>

        <div style={styles.tools}>
          <button style={styles.chip} onClick={() => setAutoSpeak((v) => !v)}>
            逐字发音：{autoSpeak ? '开' : '关'}
          </button>
          <button style={styles.chip} onClick={() => setShowPinyin((v) => !v)}>
            拼音：{showPinyin ? '显示' : '隐藏'}
          </button>
          <div style={styles.speedWrap}>
            <span style={{ fontSize: 12 }}>速度</span>
            <input
              type="range"
              min="0.6"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span style={{ fontSize: 12, width: 36, textAlign: 'right' }}>{speed.toFixed(1)}x</span>
          </div>
        </div>

        <div style={styles.grid}>
          {chars.map((char, index) => {
            const active = activeIndex === index;
            return (
              <div
                key={`${char}-${index}`}
                style={{ ...styles.box, ...(active ? styles.boxActive : {}) }}
                onClick={() => replayOne(index)}
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
          <button style={styles.btn} onClick={clearAndPractice}>清屏重练</button>
          {!quizMode ? (
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={startQuiz}>开始描红</button>
          ) : (
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setQuizMode(false)}>退出描红</button>
          )}
          <button style={styles.btn} onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

export default HanziModal;

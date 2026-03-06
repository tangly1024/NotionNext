import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PinyinChartClient = dynamic(
  () => import('@/components/PinyinChartClient'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400 font-myanmar">ခေတ္တစောင့်ဆိုင်းပါ...</p>
        </div>
      </div>
    ),
  }
);

// ==========================================
// 1. 配置区域
// ==========================================

const BASE_DOMAIN = 'https://audio.886.best/chinese-vocab-audio';
const ROOT_FOLDER = '拼音音频';
const INITIALS_FOLDER = '声母';
const FINALS_FOLDER = '韵母';
const WHOLE_FOLDER = '整体读音';
const TONES_FOLDER = '声调表';

const getAudioUrl = (folder, subFolder, filename) => {
  const parts = [ROOT_FOLDER, folder, subFolder, filename].filter(Boolean);
  const path = parts.map((part) => encodeURIComponent(part)).join('/');
  return `${BASE_DOMAIN}/${path}`;
};

// 4 个页面右侧视频
const videoConfigByType = {
  initials: {
    title: '声母示范',
    subtitle: 'Initials Demo',
    src: '/videos/pinyin/initials.mp4',
    cover: '/videos/pinyin/covers/initials.jpg',
  },
  finals: {
    title: '韵母示范',
    subtitle: 'Finals Demo',
    src: '/videos/pinyin/finals.mp4',
    cover: '/videos/pinyin/covers/finals.jpg',
  },
  whole: {
    title: '整体读音示范',
    subtitle: 'Whole Reading Demo',
    src: '/videos/pinyin/whole.mp4',
    cover: '/videos/pinyin/covers/whole.jpg',
  },
  tones: {
    title: '声调示范',
    subtitle: 'Tones Demo',
    src: '/videos/pinyin/tones.mp4',
    cover: '/videos/pinyin/covers/tones.jpg',
  },
};

// --- 缅文谐音映射表 ---
const burmeseMap = {
  b: 'ဗ (ဘ)', p: 'ပ (ဖ)', m: 'မ', f: 'ဖ(ွ)', d: 'ဒ', t: 'ထ', n: 'န', l: 'လ',
  g: 'ဂ', k: 'ခ', h: 'ဟ', j: 'ကျ', q: 'ချ', x: 'ရှ',
  zh: 'ကျ(zh)', ch: 'ချ(ch)', sh: 'ရှ(sh)', r: 'ရ(r)',
  z: 'ဇ', c: 'ဆ', s: 'ဆ(ွ)', y: 'ယ', w: 'ဝ',
  a: 'အာ', o: 'အော', e: 'အ', i: 'အီ', u: 'အူ', ü: 'ယူ',
  ai: 'အိုင်', ei: 'အေ', ui: 'ဝေ', ao: 'အောက်', ou: 'အို',
  iu: 'ယူ', ie: 'ယဲ', üe: 'ရွဲ့', er: 'အာရ်',
  an: 'အန်', en: 'အန်(en)', in: 'အင်', un: 'ဝန်း', ün: 'ရွန်း',
  ang: 'အောင်', eng: 'အိုင်(eng)', ing: 'အိုင်', ong: 'အုန်',
  zhi: 'ကျ(zh)', chi: 'ချ(ch)', shi: 'ရှ(sh)', ri: 'ရ(r)',
  zi: 'ဇ', ci: 'ဆ', si: 'ဆ(ွ)', yi: 'ယီး', wu: 'ဝူး', yu: 'ယွီး',
  ye: 'ယဲ', yue: 'ရွဲ့', yuan: 'ယွမ်', yin: 'ယင်း', yun: 'ယွန်း', ying: 'ယင်း(g)',
};

// ==========================================
// 2. 数据处理中心 (全扁平化)
// ==========================================

const flattenTones = () => {
  const categories = [
    { folder: '单韵母', rows: [['ā', 'á', 'ǎ', 'à'], ['ō', 'ó', 'ǒ', 'ò'], ['ē', 'é', 'ě', 'è'], ['ī', 'í', 'ǐ', 'ì'], ['ū', 'ú', 'ǔ', 'ù'], ['ǖ', 'ǘ', 'ǚ', 'ǜ']] },
    { folder: '复韵母', rows: [['āi', 'ái', 'ǎi', 'ài'], ['ēi', 'éi', 'ěi', 'èi'], ['uī', 'uí', 'uǐ', 'uì'], ['āo', 'áo', 'ǎo', 'ào'], ['ōu', 'óu', 'ǒu', 'òu'], ['iū', 'iú', 'iǔ', 'iù'], ['iē', 'ié', 'iě', 'iè'], ['üē', 'üé', 'üě', 'üè'], ['ēr', 'ér', 'ěr', 'èr']] },
    { folder: '鼻韵母', rows: [['ān', 'án', 'ǎn', 'àn'], ['ēn', 'én', 'ěn', 'èn'], ['īn', 'ín', 'ǐn', 'ìn'], ['ūn', 'ún', 'ǔn', 'ùn'], ['ǖn', 'ǘn', 'ǚn', 'ǜn'], ['āng', 'áng', 'ǎng', 'àng'], ['ēng', 'éng', 'ěng', 'èng'], ['īng', 'íng', 'ǐng', 'ìng'], ['ōng', 'óng', 'ǒng', 'òng']] },
    {
      folder: '整体读音',
      rows: [
        ['zhī', 'zhí', 'zhǐ', 'zhì'], ['chī', 'chí', 'chǐ', 'chì'], ['shī', 'shí', 'shǐ', 'shì'], ['rī', 'rí', 'rǐ', 'rì'],
        ['zī', 'zí', 'zǐ', 'zì'], ['cī', 'cí', 'cǐ', 'cì'], ['sī', 'sí', 'sǐ', 'sì'],
        ['yī', 'yí', 'yǐ', 'yì'], ['wū', 'wú', 'wǔ', 'wù'], ['yū', 'yú', 'yǔ', 'yù'],
        ['yē', 'yé', 'yě', 'yè'], ['yuē', 'yué', 'yuě', 'yuè'], ['yuān', 'yuán', 'yuǎn', 'yuàn'],
        ['yīn', 'yín', 'yǐn', 'yìn'], ['yūn', 'yún', 'yǔn', 'yùn'], ['yīng', 'yíng', 'yǐng', 'yìng'],
      ],
    },
  ];

  const flatList = [];
  categories.forEach((cat) => {
    cat.rows.forEach((row) => {
      row.forEach((letter) => {
        const normalizedLetter = letter.normalize('NFC');
        const cleanLetter = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        flatList.push({
          letter: normalizedLetter,
          audio: getAudioUrl(TONES_FOLDER, cat.folder, `${letter}.mp3`),
          burmese: burmeseMap[letter] || burmeseMap[cleanLetter] || '',
        });
      });
    });
  });
  return flatList;
};

const pinyinData = {
  initials: {
    title: 'ဗျည်းများ (Initials)',
    type: 'grid',
    items: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'].map((l) => ({
      letter: l, audio: getAudioUrl(INITIALS_FOLDER, null, `${l}.mp3`), burmese: burmeseMap[l] || '',
    })),
  },
  finals: {
    title: 'သရများ (Finals)',
    type: 'grid',
    items: ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe', 'er', 'an', 'en', 'in', 'un', 'ün', 'ang', 'eng', 'ing', 'ong'].map((l) => ({
      letter: l, audio: getAudioUrl(FINALS_FOLDER, null, `${l}.mp3`), burmese: burmeseMap[l] || '',
    })),
  },
  whole: {
    title: 'တစ်ဆက်တည်းဖတ်သံများ',
    type: 'grid',
    items: ['zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 'yi', 'wu', 'yu', 'ye', 'yue', 'yuan', 'yin', 'yun', 'ying'].map((l) => ({
      letter: l, audio: getAudioUrl(WHOLE_FOLDER, null, `${l}.mp3`), burmese: burmeseMap[l] || '',
    })),
  },
  tones: {
    title: 'အသံအနိမ့်အမြင့် (Tones)',
    type: 'grid',
    items: flattenTones(),
  },
};

// ==========================================
// 3. 静态路径处理 (Cloudflare Pages)
// ==========================================

export async function getStaticPaths() {
  return {
    paths: [
      { params: { chartType: 'initials' } },
      { params: { chartType: 'finals' } },
      { params: { chartType: 'whole' } },
      { params: { chartType: 'tones' } },
    ],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  return { props: { chartType: params.chartType } };
}

// ==========================================
// 4. 视频组件 (优化弹窗动画与交互)
// ==========================================

const requestFullscreenSafe = async (el) => {
  if (!el) return;
  try {
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  } catch (err) {
    console.warn("Fullscreen API not supported/allowed", err);
  }
};

const exitFullscreenSafe = async () => {
  if (typeof document === 'undefined') return;
  try {
    if (document.exitFullscreen && document.fullscreenElement) await document.exitFullscreen();
    else if (document.webkitExitFullscreen && document.webkitFullscreenElement) document.webkitExitFullscreen();
    else if (document.msExitFullscreen && document.msFullscreenElement) document.msExitFullscreen();
  } catch (err) {
    console.warn("Exit Fullscreen error", err);
  }
};

function VerticalVideoPanel({ config }) {
  const [open, setOpen] = useState(false);
  const shellRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && open) {
        if (videoRef.current) videoRef.current.pause();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, [open]);

  const openAndPlay = useCallback(async () => {
    setOpen(true);
    setTimeout(async () => {
      try { await requestFullscreenSafe(shellRef.current); } catch (_) {}
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 50); // 微小延迟确保 DOM 已经渲染 class
  }, []);

  const closePlayer = useCallback(async (e) => {
    // 阻止事件冒泡，防止误触
    if (e) e.stopPropagation(); 
    if (videoRef.current) videoRef.current.pause();
    setOpen(false);
    await exitFullscreenSafe();
  }, []);

  if (!config) return null;

  return (
    <>
      <button className="video-cover-card group" onClick={openAndPlay} type="button" aria-label={`播放 ${config.title}`}>
        {config.cover ? (
          <img className="video-cover-image group-hover:scale-105 transition-transform duration-700" src={config.cover} alt={config.title} loading="lazy" decoding="async" />
        ) : (
          <div className="video-cover-fallback">
            <span className="video-cover-fallback-text">{config.title}</span>
          </div>
        )}
        <div className="video-cover-mask">
          <div className="video-play-icon group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">▶</div>
          <p className="video-cover-title">{config.title}</p>
          <p className="video-cover-subtitle">{config.subtitle}</p>
          <span className="video-cover-action">点击全屏播放</span>
        </div>
      </button>

      {/* 优化：增加点击背景遮罩关闭，增加缩放淡入动画 */}
      <div 
        className={`video-player-overlay ${open ? 'is-open' : ''}`} 
        role="dialog" 
        aria-modal="true"
        onClick={closePlayer} 
      >
        <div 
          className={`video-player-shell ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-300 ease-out`} 
          ref={shellRef}
          onClick={(e) => e.stopPropagation()} // 阻止点击视频本身时关闭
        >
          <video ref={videoRef} className="video-player" src={config.src} controls playsInline preload="metadata" />
        </div>
        <button 
          type="button" 
          className={`video-close-btn ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 delay-100`} 
          onClick={closePlayer}
        >
          ✕ 关闭
        </button>
      </div>
    </>
  );
}

// ==========================================
// 5. 页面组件
// ==========================================

export default function PinyinChartPage({ chartType: initialType }) {
  const router = useRouter();
  const chartType = initialType || router.query.chartType;

  if (!chartType || !pinyinData[chartType]) {
    return <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center">Loading...</div>;
  }

  const chartData = pinyinData[chartType];
  const videoConfig = videoConfigByType[chartType];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Head>
        <title>{chartData.title} - 拼音学习</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="pt-4 pb-16 max-w-6xl mx-auto px-3 sm:px-6">
        <div className="pinyin-page-layout">
          {/* 
            在移动端，使用 CSS order 将视频（aside）放在顶部
            在 PC 端，视频会在右侧正常显示
          */}
          <main className="pinyin-chart-column">
            <PinyinChartClient initialData={chartData} />
          </main>
          
          <aside className="pinyin-video-column">
            <div className="sticky top-[84px]">
              <VerticalVideoPanel config={videoConfig} />
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .pinyin-letter {
          font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif !important;
          font-weight: 700;
          line-height: 1.1 !important;
          display: inline-block;
          text-shadow: none !important;
          -webkit-font-smoothing: antialiased;
          font-variant-ligatures: none;
        }

        .font-myanmar {
          font-family: 'Padauk', 'Myanmar Text', 'Pyidaungsu', sans-serif;
          line-height: 1.5;
        }

        /* --- 核心布局优化：移动端视频在上，PC端视频在右 --- */
        .pinyin-page-layout {
          display: flex;
          flex-direction: column-reverse; /* 手机端：视频在上，图表在下 */
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .pinyin-page-layout {
            flex-direction: row; /* PC端：恢复左右布局 */
            align-items: start;
          }
          .pinyin-chart-column {
            flex: 1;
            min-width: 0;
          }
          .pinyin-video-column {
            width: 260px; /* PC端固定视频宽度 */
            flex-shrink: 0;
          }
        }

        .pinyin-chart-column {
          width: 100%;
          margin: 0 auto;
        }

        .pinyin-grid-container {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }

        .pinyin-card {
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.03);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
          padding: 8px;
          user-select: none;
        }

        .dark .pinyin-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        /* 优化按压反馈：0.9太深，0.95正合适 */
        .pinyin-card:active {
          transform: scale(0.95);
          background: #f1f5f9;
        }

        .dark .pinyin-card:active {
          background: #0f172a;
        }

        .pinyin-card-letter {
          font-size: 1.6rem;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .dark .pinyin-card-letter {
          color: #f1f5f9;
        }

        .pinyin-card-burmese {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        /* 视频封面样式优化 */
        .video-cover-card {
          width: 100%;
          border: none;
          background: transparent;
          padding: 0;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 16 / 9; /* 移动端横向展示更好看 */
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        }

        @media (min-width: 1024px) {
          .video-cover-card {
             aspect-ratio: 9 / 16; /* PC端恢复竖向展示 */
          }
        }

        .video-cover-image,
        .video-cover-fallback {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .video-cover-fallback {
          background: linear-gradient(160deg, #0f172a 0%, #1e40af 45%, #0284c7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-cover-fallback-text {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .video-cover-mask {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          color: #ffffff;
          background: linear-gradient(to top, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.2) 60%);
          text-align: center;
        }

        .video-play-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-bottom: auto;
          margin-top: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .video-cover-title {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .video-cover-subtitle {
          font-size: 0.85rem;
          opacity: 0.9;
          margin-top: 4px;
        }

        .video-cover-action {
          margin-top: 12px;
          font-size: 0.76rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 6px 12px;
          border-radius: 999px;
        }

        /* 弹窗样式优化 */
        .video-player-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 20px;
          padding: 16px;
        }

        .video-player-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .video-player-shell {
          width: min(420px, 100vw - 32px);
          aspect-ratio: 9 / 16;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
        }

        .video-player {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #000;
        }

        .video-close-btn {
          border: none;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          color: #fff;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .video-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}

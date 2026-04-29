/* eslint-disable react/no-unknown-property */

const Style = () => {
  return <style jsx global>{`
    #theme-fuwari {
      --fuwari-bg: #f3f4f8;
      --fuwari-bg-soft: #f6f4e8;
      --fuwari-surface: #ffffff;
      --fuwari-muted: #72767d;
      --fuwari-text: #232a37;
      --fuwari-primary: #b8a320;
      --fuwari-primary-soft: rgba(184, 163, 32, 0.14);
      --fuwari-border: #e9e8df;
      --fuwari-gradient: linear-gradient(135deg, #b8a320 0%, #e0ce63 100%);
    }

    .dark #theme-fuwari {
      --fuwari-bg: #0d1117;
      --fuwari-bg-soft: #131a25;
      --fuwari-surface: #171f2c;
      --fuwari-muted: #9ca3af;
      --fuwari-text: #f3f4f6;
      --fuwari-primary: #d3bf53;
      --fuwari-primary-soft: rgba(211, 191, 83, 0.2);
      --fuwari-border: #283446;
      --fuwari-gradient: linear-gradient(135deg, #8576ff 0%, #4ba9ff 100%);
    }

    #theme-fuwari.fuwari-bg {
      background:
        radial-gradient(circle at 10% -10%, var(--fuwari-primary-soft) 0, transparent 45%),
        radial-gradient(circle at 100% 10%, rgba(122, 199, 255, 0.14) 0, transparent 35%),
        var(--fuwari-bg);
    }

    #theme-fuwari {
      transition: background-color 0.2s ease, color 0.2s ease;
      overflow-x: clip;
    }

    #theme-fuwari .fuwari-card {
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    #theme-fuwari .fuwari-card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 44px rgba(15, 23, 42, 0.12);
    }

    #theme-fuwari .fuwari-cover-wrap {
      overflow: hidden;
      border-radius: 16px;
    }

    #theme-fuwari .fuwari-cover-wrap img {
      transition: transform 0.35s ease;
    }
    #theme-fuwari .fuwari-profile-card {
      padding: .95rem;
    }
    #theme-fuwari .fuwari-profile-link {
      border-radius: 1rem;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-profile-thumb {
      background: var(--fuwari-bg-soft);
      transform: translateY(0) scale(1);
      transition: transform .2s ease;
    }
    #theme-fuwari .fuwari-profile-thumb img {
      transition: transform .24s ease, filter .24s ease;
    }
    #theme-fuwari .fuwari-profile-overlay {
      position: absolute;
      inset: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 2rem;
      background: rgba(12, 18, 30, .24);
      opacity: 0;
      transform: scale(.92);
      transition: opacity .2s ease, transform .2s ease;
      pointer-events: none;
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-thumb {
      transform: translateY(1px) scale(.992);
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-thumb img {
      transform: scale(1.02);
      filter: saturate(1.03) brightness(.9);
    }
    #theme-fuwari .fuwari-profile-link:hover .fuwari-profile-overlay {
      opacity: 1;
      transform: scale(1);
    }

    #theme-fuwari .fuwari-card-hover:hover .fuwari-cover-enlarge img {
      transform: scale(1.03);
    }

    #theme-fuwari .fuwari-link {
      color: var(--fuwari-primary);
      transition: opacity 0.2s ease;
    }
    #theme-fuwari .fuwari-link:hover {
      opacity: 0.78;
    }
    #theme-fuwari .fuwari-footer {
      border-top: 1px dashed color-mix(in oklab, var(--fuwari-border) 85%, transparent);
      background: transparent;
    }
    #theme-fuwari .fuwari-copy-btn {
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 24%, var(--fuwari-border));
      background: color-mix(in oklab, var(--fuwari-primary) 8%, var(--fuwari-surface));
      color: color-mix(in oklab, var(--fuwari-primary) 80%, var(--fuwari-text));
      border-radius: .6rem;
      font-size: .8rem;
      font-weight: 600;
      padding: .35rem .65rem;
      transition: all .2s ease;
    }
    #theme-fuwari .fuwari-copy-btn:hover {
      background: color-mix(in oklab, var(--fuwari-primary) 14%, var(--fuwari-surface));
    }

    #theme-fuwari .fuwari-navbar {
      backdrop-filter: blur(8px);
      background: color-mix(in oklab, var(--fuwari-surface) 86%, transparent);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
    #theme-fuwari .fuwari-tool-btn {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 0.65rem;
      border: 1px solid color-mix(in oklab, var(--fuwari-border) 75%, transparent);
      background: color-mix(in oklab, var(--fuwari-bg-soft) 82%, #fff);
      color: color-mix(in oklab, var(--fuwari-primary) 56%, var(--fuwari-muted));
      font-size: .86rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all .2s ease;
    }
    #theme-fuwari .fuwari-tool-btn:hover {
      color: var(--fuwari-primary);
      transform: translateY(-1px);
    }
    #theme-fuwari .fuwari-theme-panel {
      background: var(--fuwari-surface);
      border-radius: 16px;
    }
    #theme-fuwari .fuwari-hue-wrap {
      width: 100%;
      height: 1.5rem;
      padding: 0 .25rem;
      border-radius: .5rem;
      background: color-mix(in oklab, var(--fuwari-bg-soft) 90%, transparent);
    }
    #theme-fuwari .fuwari-hue-slider {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 1.5rem;
      background: linear-gradient(
        90deg,
        hsl(0, 85%, 65%) 0%,
        hsl(60, 85%, 65%) 16%,
        hsl(120, 85%, 65%) 32%,
        hsl(180, 85%, 65%) 48%,
        hsl(240, 85%, 65%) 64%,
        hsl(300, 85%, 65%) 82%,
        hsl(360, 85%, 65%) 100%
      );
      border-radius: .5rem;
    }
    #theme-fuwari .fuwari-hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: .55rem;
      height: 1rem;
      border-radius: .2rem;
      background: rgba(255,255,255,.88);
      border: 1px solid rgba(0,0,0,.08);
      cursor: pointer;
    }
    #theme-fuwari .fuwari-hue-slider::-moz-range-thumb {
      width: .55rem;
      height: 1rem;
      border-radius: .2rem;
      background: rgba(255,255,255,.88);
      border: 1px solid rgba(0,0,0,.08);
      cursor: pointer;
    }

    #theme-fuwari .fuwari-hero {
      position: relative;
      min-height: 56vh;
      max-height: 72vh;
      border-radius: 0;
      margin-top: -92px;
      padding-top: 92px;
    }
    #theme-fuwari .fuwari-hero-content {
      padding-top: clamp(3.5rem, 10vh, 7rem);
      padding-bottom: 2rem;
    }
    @media (max-width: 768px) {
      #theme-fuwari .fuwari-hero {
        min-height: 26vh;
        max-height: 36vh;
        margin-top: -72px;
        padding-top: 72px;
      }
      #theme-fuwari .fuwari-main-overlap {
        margin-top: -18px;
      }
      #theme-fuwari .fuwari-navbar {
        border-radius: 0 0 14px 14px;
      }
      #theme-fuwari #posts-wrapper > article {
        border-radius: 1rem;
      }
      #theme-fuwari .fuwari-post-title {
        font-size: 2rem !important;
      }
      #theme-fuwari .fuwari-summary {
        -webkit-line-clamp: 2;
      }
      #theme-fuwari .fuwari-profile-card {
        margin-top: .25rem;
      }
    }
    #theme-fuwari .fuwari-hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.03);
      filter: saturate(1.05);
    }
    #theme-fuwari .fuwari-hero-mask {
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, rgba(15, 23, 42, 0.66), rgba(15, 23, 42, 0.3));
      z-index: 1;
    }
    #theme-fuwari .fuwari-hero-btn {
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      color: #111827;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.55rem 0.95rem;
    }
    #theme-fuwari .fuwari-hero-btn-soft {
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    #theme-fuwari .fuwari-hero-credit {
      position: absolute;
      right: 1.1rem;
      bottom: 1rem;
      font-size: .7rem;
      color: rgba(255,255,255,.9);
      background: rgba(0,0,0,.36);
      border-radius: 999px;
      padding: .25rem .6rem;
    }

    #theme-fuwari .fuwari-overlap {
      margin-top: -26px;
      position: relative;
      z-index: 5;
    }
    #theme-fuwari .fuwari-main-overlap {
      margin-top: -42px;
      position: relative;
      z-index: 10;
    }

    #theme-fuwari .fuwari-chip {
      background: var(--fuwari-bg-soft);
      border: 1px solid var(--fuwari-border);
      border-radius: 999px;
      color: var(--fuwari-muted);
      font-size: 12px;
      line-height: 1;
      padding: 0.45rem 0.75rem;
    }

    #theme-fuwari .fuwari-title-gradient {
      background: var(--fuwari-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    #theme-fuwari .fuwari-prose :is(h1, h2, h3, h4, h5) {
      color: var(--fuwari-text);
    }

    #theme-fuwari #article-wrapper .notion {
      font-size: 1rem;
    }

    #theme-fuwari .catalog-item span {
      color: var(--fuwari-muted);
    }

    #theme-fuwari .fuwari-summary {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    #theme-fuwari .fuwari-meta-row {
      display: flex;
      align-items: center;
      gap: .35rem .42rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .76rem;
      color: #8c9097;
      min-height: 1.5rem;
    }
    #theme-fuwari .fuwari-meta-item {
      display: inline-flex;
      align-items: center;
      gap: .34rem;
      padding: 0;
      border-radius: 0;
      background: transparent;
      border: none;
      color: #777d86;
      flex: 0 0 auto;
    }
    #theme-fuwari .fuwari-meta-icon {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: .28rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .72rem;
      color: color-mix(in oklab, var(--fuwari-primary) 72%, #9aa0aa);
      background: color-mix(in oklab, var(--fuwari-primary) 13%, #faf8ed);
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-meta-text {
      color: #7d838d;
    }
    #theme-fuwari .fuwari-meta-tags {
      display: inline-flex;
      align-items: center;
      gap: .28rem;
      min-height: 1.28rem;
      color: #838892;
      flex: 0 0 auto;
    }
    #theme-fuwari .fuwari-meta-tags i {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: .28rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: .72rem;
      color: color-mix(in oklab, var(--fuwari-primary) 72%, #9aa0aa);
      background: color-mix(in oklab, var(--fuwari-primary) 13%, #faf8ed);
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-post-title {
      position: relative;
      padding-left: 12px;
    }
    #theme-fuwari .fuwari-post-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: .45rem;
      width: 4px;
      height: 1.45rem;
      border-radius: 999px;
      background: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-section-title {
      position: relative;
      padding-left: 10px;
    }
    #theme-fuwari .fuwari-section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: .2rem;
      width: 3px;
      height: 14px;
      border-radius: 999px;
      background: var(--fuwari-primary);
    }

    #theme-fuwari .fuwari-float-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid color-mix(in oklab, var(--fuwari-border) 85%, transparent);
      background: var(--fuwari-surface);
      color: color-mix(in oklab, var(--fuwari-primary) 75%, var(--fuwari-muted));
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    #theme-fuwari .fuwari-float-btn:hover {
      transform: translateY(-2px);
      opacity: 0.88;
    }
    #theme-fuwari .fuwari-float-wrap {
      right: max(1rem, calc((100vw - 72rem) / 2 - 2.8rem));
      bottom: 1.15rem;
    }
    #theme-fuwari .fuwari-toc-mobile {
      position: fixed;
      inset: 0;
      z-index: 60;
    }
    #theme-fuwari .fuwari-toc-mask {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, .32);
      backdrop-filter: blur(1.5px);
    }
    #theme-fuwari .fuwari-toc-panel {
      position: absolute;
      right: .8rem;
      bottom: 4.35rem;
      width: min(21rem, calc(100vw - 1.6rem));
      max-height: 58vh;
      overflow: hidden;
    }
    @media (max-width: 1280px) {
      #theme-fuwari .fuwari-float-wrap {
        right: 1.05rem;
        bottom: 1rem;
      }
    }
    #theme-fuwari .fuwari-social-btn {
      width: 1.95rem;
      height: 1.95rem;
      border-radius: .65rem;
      background: color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface));
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 22%, var(--fuwari-border));
      color: color-mix(in oklab, var(--fuwari-primary) 88%, #8c8c8c);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all .18s ease;
    }
    #theme-fuwari .fuwari-social-btn:hover {
      transform: translateY(-1px);
      color: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-analytics-item {
      padding: .7rem .35rem;
      border-radius: .85rem;
    }
    #theme-fuwari .fuwari-analytics-label {
      font-size: 10px;
      line-height: 1.2;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--fuwari-muted);
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
    }
    #theme-fuwari .fuwari-readmore-rail {
      width: 3.5rem;
      min-width: 3.5rem;
      border-radius: 1rem;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in oklab, var(--fuwari-primary) 16%, var(--fuwari-border));
      background: color-mix(in oklab, var(--fuwari-primary) 8%, var(--fuwari-surface));
      color: var(--fuwari-primary);
      font-size: 1.06rem;
      transition: all .2s ease;
      opacity: .95;
    }
    #theme-fuwari .fuwari-pagination {
      --_page-size: 2.75rem;
    }
    #theme-fuwari .fuwari-page-btn,
    #theme-fuwari .fuwari-page-num {
      width: var(--_page-size);
      height: var(--_page-size);
      border-radius: .75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: color-mix(in oklab, var(--fuwari-text) 70%, #8f8f8f);
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      transition: all .18s ease;
    }
    #theme-fuwari .fuwari-page-btn:hover,
    #theme-fuwari .fuwari-page-num:hover {
      color: var(--fuwari-primary);
      border-color: color-mix(in oklab, var(--fuwari-primary) 30%, var(--fuwari-border));
    }
    #theme-fuwari .fuwari-page-box {
      border-radius: .85rem;
      background: var(--fuwari-surface);
      border: 1px solid var(--fuwari-border);
      padding: .15rem;
    }
    #theme-fuwari .fuwari-page-num-active {
      color: #fff;
      background: var(--fuwari-primary);
      border-color: var(--fuwari-primary);
    }
    #theme-fuwari .fuwari-page-btn-disabled {
      pointer-events: none;
      opacity: .45;
    }
    #theme-fuwari .fuwari-page-ellipsis {
      width: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--fuwari-muted);
      font-size: .8rem;
    }
    #theme-fuwari #posts-wrapper article:hover .fuwari-readmore-rail {
      background: color-mix(in oklab, var(--fuwari-primary) 10%, var(--fuwari-surface));
      transform: translateX(1px);
    }
    #theme-fuwari #posts-wrapper article {
      border-radius: 1.15rem;
    }
    #theme-fuwari aside > section.fuwari-card {
      border-radius: 1.05rem;
    }
    #theme-fuwari aside .fuwari-card {
      box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
    }
    #theme-fuwari aside .fuwari-chip {
      font-size: 13px;
      padding: .45rem .72rem;
    }
    #theme-fuwari aside .fuwari-card h3 {
      letter-spacing: .06em;
    }
    #theme-fuwari .fuwari-card,
    #theme-fuwari #posts-wrapper > article {
      animation: fuwari-enter .28s ease both;
    }
    @keyframes fuwari-enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
}

export { Style }


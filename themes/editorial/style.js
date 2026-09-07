/* eslint-disable react/no-unknown-property */
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import CONFIG from './config'

export const Style = () => {
  return (
    <style jsx global>{`
      ${themeConsoleStyle('editorial', CONFIG)}

      #theme-editorial {
        --editorial-bg: var(--editorial-console-bg);
        --editorial-surface: var(--editorial-console-card);
        --editorial-text: var(--editorial-console-text);
        --editorial-secondary: var(--editorial-console-text-secondary);
        --editorial-accent: var(--editorial-console-primary);
        --editorial-border: var(--editorial-console-border);
        --editorial-serif: Georgia, 'Times New Roman', 'Songti SC', 'Noto Serif CJK SC', serif;
        --editorial-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
        min-height: 100vh; background: var(--editorial-bg); color: var(--editorial-text);
        font-family: var(--editorial-sans); transition: background-color .25s ease, color .25s ease;
      }
      #theme-editorial ::selection { background: var(--editorial-accent); color: #fff; }
      #theme-editorial a { color: inherit; text-decoration: none; }
      .editorial-header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid var(--editorial-border); background: var(--editorial-bg); background: color-mix(in srgb, var(--editorial-bg) 91%, transparent); backdrop-filter: blur(16px); }
      .editorial-header-inner { max-width: 1280px; min-height: 72px; margin: auto; padding: 0 32px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 28px; }
      .editorial-brand { display: inline-flex; align-items: center; gap: 10px; width: fit-content; font-family: var(--editorial-serif); font-size: 19px; font-weight: 700; }
      .editorial-brand-mark { color: var(--editorial-accent); font-size: 23px; }
      .editorial-nav { display: flex; align-items: center; gap: 30px; }
      .editorial-nav-link { position: relative; padding: 25px 0 22px; color: var(--editorial-secondary); font-size: 13px; letter-spacing: .08em; }
      .editorial-nav-link:after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--editorial-accent); transform: scaleX(0); transition: transform .25s ease; }
      .editorial-nav-link:hover, .editorial-nav-link.active { color: var(--editorial-text); }
      .editorial-nav-link.active:after, .editorial-nav-link:hover:after { transform: scaleX(1); }
      .editorial-header-actions { justify-self: end; display: flex; gap: 5px; }
      .editorial-icon-button { width: 38px; height: 38px; border: 0; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; color: var(--editorial-secondary); background: transparent; cursor: pointer; transition: .2s ease; }
      .editorial-icon-button:hover { color: var(--editorial-text); background: var(--editorial-surface); box-shadow: 0 0 0 1px var(--editorial-border); }
      .editorial-icon { display: block; width: 18px; height: 18px; }
      .editorial-mobile-toggle, .editorial-mobile-nav { display: none; }
      .editorial-shell { width: min(100% - 48px, 1120px); margin: 0 auto; }
      .editorial-shell-with-toc { display: grid; grid-template-columns: minmax(0, 760px) 230px; gap: 90px; justify-content: center; }
      .editorial-main { min-width: 0; }
      .editorial-toc-aside { position: relative; }
      .editorial-toc { position: sticky; top: 110px; padding: 10px 0 10px 24px; border-left: 1px solid var(--editorial-border); max-height: calc(100vh - 140px); overflow: auto; }
      .editorial-toc-title, .editorial-section-label { margin-bottom: 18px; color: var(--editorial-secondary); font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
      .editorial-toc a { display: block; padding-top: 7px; padding-bottom: 7px; color: var(--editorial-secondary); font-size: 12px; line-height: 1.45; transition: color .2s ease; }
      .editorial-toc a:hover, .editorial-toc a.active { color: var(--editorial-accent); }
      .editorial-hero { padding: 110px 0 72px; }
      .editorial-kicker { margin-bottom: 28px; color: var(--editorial-accent); font-size: 11px; font-weight: 700; letter-spacing: .2em; }
      .editorial-hero h1 { max-width: 950px; margin: 0; font-family: var(--editorial-serif); font-size: clamp(54px, 8vw, 106px); font-weight: 700; letter-spacing: -.055em; line-height: .98; }
      .editorial-hero > p { max-width: 610px; margin: 34px 0 54px auto; color: var(--editorial-secondary); font-family: var(--editorial-serif); font-size: clamp(18px, 2vw, 24px); line-height: 1.65; }
      .editorial-hero-rule { padding-top: 13px; border-top: 1px solid var(--editorial-border); display: flex; justify-content: space-between; color: var(--editorial-secondary); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
      .editorial-list-section { padding: 26px 0 80px; }
      .editorial-post-list { border-top: 2px solid var(--editorial-text); }
      .editorial-post-card { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 38px; padding: 34px 0; border-bottom: 1px solid var(--editorial-border); }
      .editorial-post-card.featured { grid-template-columns: minmax(280px, .8fr) minmax(0, 1fr); gap: 60px; align-items: center; padding: 42px 0 50px; }
      .editorial-post-copy { display: flex; flex-direction: column; align-items: flex-start; }
      .editorial-post-card:not(.featured) .editorial-post-copy { grid-column: 1; grid-row: 1; }
      .editorial-post-card:not(.featured) .editorial-post-cover { grid-column: 2; grid-row: 1; }
      .editorial-post-eyebrow { width: 100%; margin-bottom: 16px; display: flex; justify-content: space-between; gap: 16px; color: var(--editorial-secondary); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
      .editorial-post-eyebrow a { color: var(--editorial-accent); }
      .editorial-post-title { margin: 0 0 13px; font-family: var(--editorial-serif); font-size: clamp(25px, 3vw, 39px); font-weight: 700; letter-spacing: -.025em; line-height: 1.22; }
      .editorial-post-card.featured .editorial-post-title { font-size: clamp(33px, 4.5vw, 58px); line-height: 1.1; }
      .editorial-post-title a:hover { color: var(--editorial-accent); }
      .editorial-post-summary { margin: 0 0 22px; color: var(--editorial-secondary); font-family: var(--editorial-serif); font-size: 16px; line-height: 1.75; }
      .editorial-article-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: var(--editorial-secondary); font-size: 11px; letter-spacing: .04em; }
      .editorial-article-meta a:hover { color: var(--editorial-accent); }
      .editorial-post-cover { display: block; min-height: 160px; overflow: hidden; background: var(--editorial-surface); }
      .editorial-post-card.featured .editorial-post-cover { min-height: 300px; }
      .editorial-post-cover-image, .editorial-post-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.16,1,.3,1); }
      .editorial-post-cover:hover .editorial-post-cover-image, .editorial-post-cover:hover img { transform: scale(1.035); }
      .editorial-post-tags { margin-top: 2px; display: flex; flex-wrap: wrap; gap: 10px; color: var(--editorial-secondary); font-size: 11px; }
      .editorial-post-tags a:hover { color: var(--editorial-accent); }
      .editorial-read-more { margin-top: 22px; color: var(--editorial-accent) !important; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .editorial-pagination { display: flex; justify-content: space-between; padding-top: 34px; }
      .editorial-pagination a { padding-bottom: 4px; color: var(--editorial-secondary); border-bottom: 1px solid var(--editorial-border); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
      .editorial-pagination a:hover { color: var(--editorial-accent); border-color: var(--editorial-accent); }
      .editorial-pagination a.disabled { visibility: hidden; pointer-events: none; }
      .editorial-page-heading { padding: 90px 0 35px; border-bottom: 1px solid var(--editorial-border); }
      .editorial-page-heading span { color: var(--editorial-accent); font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
      .editorial-page-heading h1 { margin: 14px 0 0; font-family: var(--editorial-serif); font-size: clamp(44px, 7vw, 76px); letter-spacing: -.045em; }
      .editorial-article-header { padding: 96px 0 48px; border-bottom: 1px solid var(--editorial-border); }
      .editorial-article-kicker { margin-bottom: 24px; display: flex; justify-content: space-between; gap: 18px; color: var(--editorial-secondary); font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
      .editorial-article-kicker a { color: var(--editorial-accent); }
      .editorial-article-title { margin: 0 0 28px; font-family: var(--editorial-serif); font-size: clamp(44px, 7vw, 76px); font-weight: 700; letter-spacing: -.045em; line-height: 1.08; }
      .editorial-article-deck { max-width: 680px; margin: 0 0 24px; color: var(--editorial-secondary); font-family: var(--editorial-serif); font-size: 20px; line-height: 1.65; }
      .editorial-article-tags { display: flex; flex-wrap: wrap; gap: 8px; }
      .editorial-article-tags a { padding: 4px 9px; border: 1px solid var(--editorial-border); border-radius: 999px; color: var(--editorial-secondary); font-size: 11px; }
      .editorial-article-tags a:hover { color: var(--editorial-accent); border-color: var(--editorial-accent); }
      #theme-editorial #article-wrapper { padding: 50px 0 20px; }
      #theme-editorial #article-wrapper .notion { color: var(--editorial-text); font-family: var(--editorial-serif); font-size: 18px; line-height: 1.9; }
      #theme-editorial #article-wrapper .notion-page { width: 100%; padding: 0; }
      #theme-editorial #article-wrapper .notion-text { padding: 5px 0; }
      #theme-editorial #article-wrapper .notion-h { color: var(--editorial-text); font-family: var(--editorial-serif); font-weight: 700; letter-spacing: -.025em; scroll-margin-top: 100px; }
      #theme-editorial #article-wrapper .notion-h1 { margin-top: 2.2em; font-size: 36px; }
      #theme-editorial #article-wrapper .notion-h2 { margin-top: 2em; font-size: 29px; }
      #theme-editorial #article-wrapper .notion-h3 { margin-top: 1.7em; font-size: 23px; }
      #theme-editorial #article-wrapper .notion-quote { margin: 30px 0; padding: 8px 0 8px 25px; border-left: 3px solid var(--editorial-accent); color: var(--editorial-secondary); font-size: 21px; font-style: italic; }
      #theme-editorial #article-wrapper .notion-callout { border: 1px solid var(--editorial-border); border-radius: 8px; background: var(--editorial-surface); }
      #theme-editorial #article-wrapper .notion-code { border-radius: 8px; }
      #theme-editorial #article-wrapper .notion-asset-wrapper { margin: 38px auto; }
      #theme-editorial #article-wrapper .notion-asset-caption { color: var(--editorial-secondary); font-family: var(--editorial-sans); font-size: 12px; }
      #theme-editorial #article-wrapper a { color: var(--editorial-accent); text-decoration-color: color-mix(in srgb, var(--editorial-accent) 45%, transparent); text-underline-offset: 4px; }
      .editorial-article-around { margin: 58px 0 36px; padding: 26px 0; border-top: 1px solid var(--editorial-border); border-bottom: 1px solid var(--editorial-border); display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
      .editorial-article-around a { display: flex; flex-direction: column; gap: 8px; font-family: var(--editorial-serif); line-height: 1.4; }
      .editorial-article-around a:last-child { text-align: right; }
      .editorial-article-around small, .editorial-recommend small { color: var(--editorial-accent); font-family: var(--editorial-sans); font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
      .editorial-article-around a:hover span { color: var(--editorial-accent); }
      .editorial-recommend { margin: 40px 0 60px; }
      .editorial-recommend-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--editorial-border); }
      .editorial-recommend-grid a { display: flex; gap: 16px; padding: 20px 14px 20px 0; border-bottom: 1px solid var(--editorial-border); font-family: var(--editorial-serif); }
      .editorial-recommend-grid a:hover span { color: var(--editorial-accent); }
      .editorial-archive, .editorial-taxonomy { padding-bottom: 90px; }
      .editorial-archive-group { display: grid; grid-template-columns: 130px 1fr; gap: 25px; padding: 28px 0; border-bottom: 1px solid var(--editorial-border); }
      .editorial-archive-group h2 { margin: 0; color: var(--editorial-secondary); font-family: var(--editorial-serif); font-size: 22px; font-style: italic; }
      .editorial-archive-group li { display: grid; grid-template-columns: minmax(0, 1fr) 100px; gap: 20px; padding: 8px 0; }
      .editorial-archive-group time { color: var(--editorial-secondary); font-size: 11px; text-align: right; }
      .editorial-archive-group a { font-family: var(--editorial-serif); }
      .editorial-archive-group a:hover { color: var(--editorial-accent); }
      .editorial-taxonomy-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin-top: 40px; background: var(--editorial-border); border: 1px solid var(--editorial-border); }
      .editorial-taxonomy-item { padding: 25px; background: var(--editorial-bg); display: flex; justify-content: space-between; align-items: baseline; }
      .editorial-taxonomy-item span:first-child { font-family: var(--editorial-serif); font-size: 19px; }
      .editorial-taxonomy-item small { color: var(--editorial-secondary); }
      .editorial-taxonomy-item:hover { color: var(--editorial-accent); background: var(--editorial-surface); }
      .editorial-empty { min-height: 65vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
      .editorial-empty > span { color: var(--editorial-accent); font-size: 11px; font-weight: 700; letter-spacing: .18em; }
      .editorial-empty h1 { margin: 16px 0 24px; font-family: var(--editorial-serif); font-size: clamp(40px, 7vw, 72px); }
      .editorial-empty a { color: var(--editorial-secondary); border-bottom: 1px solid var(--editorial-border); }
      .editorial-footer { max-width: 1120px; margin: 60px auto 0; padding: 38px 0 48px; border-top: 1px solid var(--editorial-border); display: flex; justify-content: space-between; color: var(--editorial-secondary); font-size: 11px; }
      .editorial-footer-brand { color: var(--editorial-text) !important; font-family: var(--editorial-serif); font-size: 17px; font-weight: 700; }
      .editorial-to-top { position: fixed; right: 24px; bottom: 24px; z-index: 30; }
      .editorial-loading { min-height: 55vh; display: flex; align-items: center; justify-content: center; }
      .editorial-loading span { width: 28px; height: 28px; border: 1px solid var(--editorial-border); border-top-color: var(--editorial-accent); border-radius: 50%; animation: editorial-spin .8s linear infinite; }
      .editorial-search-mark { color: var(--editorial-accent); background: transparent; border-bottom: 1px solid var(--editorial-accent); }
      @keyframes editorial-spin { to { transform: rotate(360deg); } }
      @media (max-width: 1023px) {
        .editorial-shell-with-toc { display: block; }
        .editorial-toc-aside { display: none; }
        .editorial-taxonomy-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 767px) {
        .editorial-header-inner { min-height: 62px; padding: 0 20px; grid-template-columns: 1fr auto; }
        .editorial-nav { display: none; }
        .editorial-header-actions { gap: 0; }
        .editorial-mobile-toggle { display: inline-flex; }
        .editorial-mobile-nav { display: flex; flex-direction: column; padding: 8px 20px 20px; border-top: 1px solid var(--editorial-border); }
        .editorial-mobile-nav .editorial-nav-link { padding: 11px 0; }
        .editorial-shell { width: min(100% - 36px, 1120px); }
        .editorial-hero { padding: 72px 0 48px; }
        .editorial-hero h1 { font-size: clamp(45px, 15vw, 68px); }
        .editorial-hero > p { margin: 28px 0 40px; font-size: 18px; }
        .editorial-post-card, .editorial-post-card.featured { grid-template-columns: 1fr; gap: 22px; }
        .editorial-post-card:not(.featured) .editorial-post-copy, .editorial-post-card:not(.featured) .editorial-post-cover { grid-column: auto; }
        .editorial-post-card:not(.featured) .editorial-post-copy { grid-row: 2; }
        .editorial-post-card.featured .editorial-post-cover { min-height: 220px; grid-row: 1; }
        .editorial-post-cover { min-height: 210px; grid-row: 1; }
        .editorial-page-heading, .editorial-article-header { padding-top: 62px; }
        .editorial-article-header h1 { font-size: clamp(38px, 11vw, 56px); }
        #theme-editorial #article-wrapper { padding-top: 36px; }
        #theme-editorial #article-wrapper .notion { font-size: 17px; }
        .editorial-article-around, .editorial-recommend-grid { grid-template-columns: 1fr; }
        .editorial-article-around a:last-child { text-align: left; }
        .editorial-archive-group { grid-template-columns: 1fr; gap: 12px; }
        .editorial-archive-group li { grid-template-columns: 78px 1fr; gap: 12px; }
        .editorial-taxonomy-grid { grid-template-columns: 1fr; }
        .editorial-footer { width: calc(100% - 36px); flex-direction: column; gap: 12px; }
      }
    `}</style>
  )
}

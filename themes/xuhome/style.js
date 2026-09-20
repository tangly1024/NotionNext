/* eslint-disable react/no-unknown-property */
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import { siteConfig } from '@/lib/config'
import { getReadableForeground } from '@/lib/themeColorUtils'
import CONFIG from './config'

const Style = () => {
  const primary = siteConfig(
    'XUHOME_COLOR_PRIMARY',
    CONFIG.XUHOME_COLOR_PRIMARY,
    CONFIG
  )
  const primaryHover = siteConfig(
    'XUHOME_COLOR_PRIMARY_HOVER',
    CONFIG.XUHOME_COLOR_PRIMARY_HOVER,
    CONFIG
  )
  const accent = siteConfig(
    'XUHOME_COLOR_ACCENT',
    CONFIG.XUHOME_COLOR_ACCENT,
    CONFIG
  )
  const primaryDark = siteConfig(
    'XUHOME_COLOR_PRIMARY_DARK',
    CONFIG.XUHOME_COLOR_PRIMARY_DARK,
    CONFIG
  )
  const primaryHoverDark = siteConfig(
    'XUHOME_COLOR_PRIMARY_HOVER_DARK',
    CONFIG.XUHOME_COLOR_PRIMARY_HOVER_DARK,
    CONFIG
  )
  const accentDark = siteConfig(
    'XUHOME_COLOR_ACCENT_DARK',
    CONFIG.XUHOME_COLOR_ACCENT_DARK,
    CONFIG
  )

  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }

      #theme-xuhome {
        --xuhome-color-primary-hover: ${siteConfig('XUHOME_COLOR_PRIMARY_HOVER', CONFIG.XUHOME_COLOR_PRIMARY_HOVER, CONFIG)};
        --xuhome-color-accent: ${siteConfig('XUHOME_COLOR_ACCENT', CONFIG.XUHOME_COLOR_ACCENT, CONFIG)};
        --xuhome-color-primary-hover-dark: ${primaryHoverDark};
        --xuhome-color-accent-dark: ${accentDark};
        --xuhome-hero-title-color: ${siteConfig('XUHOME_HERO_TITLE_COLOR', CONFIG.XUHOME_HERO_TITLE_COLOR, CONFIG)};
        --xuhome-hero-bio-color: ${siteConfig('XUHOME_HERO_BIO_COLOR', CONFIG.XUHOME_HERO_BIO_COLOR, CONFIG)};
        --xuhome-on-primary-light: ${getReadableForeground(primary)};
        --xuhome-on-primary-hover-light: ${getReadableForeground(primaryHover)};
        --xuhome-on-accent-light: ${getReadableForeground(accent)};
        --xuhome-on-primary-dark: ${getReadableForeground(primaryDark)};
        --xuhome-on-primary-hover-dark: ${getReadableForeground(primaryHoverDark)};
        --xuhome-on-accent-dark: ${getReadableForeground(accentDark)};
        --xuhome-primary: var(--xuhome-console-primary);
        --xuhome-primary-hover: var(--xuhome-console-primary-hover);
        --xuhome-accent: var(--xuhome-color-accent);
        --xuhome-on-primary: var(--xuhome-on-primary-light);
        --xuhome-on-primary-hover: var(--xuhome-on-primary-hover-light);
        --xuhome-on-accent: var(--xuhome-on-accent-light);
        --xuhome-hero-title-active: var(--xuhome-hero-title-color);
        --xuhome-hero-bio-active: var(--xuhome-hero-bio-color);
        --xuhome-bg-light: var(--xuhome-console-bg);
        --xuhome-surface-light: var(--xuhome-console-card);
        --xuhome-text-light: var(--xuhome-console-text);
        --xuhome-muted-light: var(--xuhome-console-text-secondary);
        --xuhome-bg-dark: var(--xuhome-console-bg);
        --xuhome-surface-dark: var(--xuhome-console-card);
        --xuhome-text-dark: var(--xuhome-console-text);
        --xuhome-muted-dark: var(--xuhome-console-text-secondary);
        background-color: var(--xuhome-console-bg);
        color: var(--xuhome-console-text);
      }
      .dark #theme-xuhome {
        --xuhome-accent: var(--xuhome-color-accent-dark);
        --xuhome-on-primary: var(--xuhome-on-primary-dark);
        --xuhome-on-primary-hover: var(--xuhome-on-primary-hover-dark);
        --xuhome-on-accent: var(--xuhome-on-accent-dark);
        --xuhome-hero-title-active: var(--xuhome-console-primary);
        --xuhome-hero-bio-active: var(--xuhome-console-text-secondary);
        background-color: var(--xuhome-console-bg);
        color: var(--xuhome-console-text);
        color-scheme: dark;
      }

      /* XuHome uses arbitrary Tailwind colors extensively. Map those legacy
         utility tokens to the live theme-console variables. */
      #theme-xuhome [class~='border-[#0284c7]'] {
        border-color: var(--xuhome-console-border) !important;
      }
      #theme-xuhome [class~='border-[#fde68a]'] {
        border-color: var(--xuhome-accent) !important;
      }
      #theme-xuhome [class~='text-[#0284c7]'] {
        color: var(--xuhome-console-primary) !important;
      }
      #theme-xuhome [class~='text-[#0284c7]/60'] {
        color: color-mix(
          in srgb,
          var(--xuhome-console-primary) 60%,
          transparent
        ) !important;
      }
      #theme-xuhome [class~='bg-[#0284c7]'] {
        background-color: var(--xuhome-console-primary) !important;
      }
      #theme-xuhome [class~='bg-[#fde68a]'] {
        background-color: var(--xuhome-accent) !important;
      }
      #theme-xuhome [class~='bg-[#fde68a]'][class~='text-[#0284c7]'] {
        color: var(--xuhome-on-accent) !important;
      }
      #theme-xuhome [class~='bg-[#ffffff]'],
      #theme-xuhome [class~='bg-white'] {
        background-color: var(--xuhome-console-card) !important;
      }
      #theme-xuhome [class~='bg-[#faf8f5]'] {
        background-color: var(--xuhome-console-bg) !important;
      }
      #theme-xuhome [class~='text-slate-900'],
      #theme-xuhome [class~='text-slate-800'],
      #theme-xuhome [class~='dark:text-slate-100']:is(.dark *),
      #theme-xuhome [class~='dark:text-slate-200']:is(.dark *) {
        color: var(--xuhome-console-text) !important;
      }
      #theme-xuhome [class~='text-slate-700'],
      #theme-xuhome [class~='text-slate-600'],
      #theme-xuhome [class~='text-slate-500'],
      #theme-xuhome [class~='text-slate-400'],
      #theme-xuhome [class~='text-slate-300'],
      #theme-xuhome [class~='dark:text-slate-300']:is(.dark *),
      #theme-xuhome [class~='dark:text-slate-400']:is(.dark *),
      #theme-xuhome [class~='dark:text-slate-500']:is(.dark *),
      #theme-xuhome [class~='dark:text-slate-600']:is(.dark *) {
        color: var(--xuhome-console-text-secondary) !important;
      }
      .dark #theme-xuhome [class~='dark:bg-slate-600'],
      .dark #theme-xuhome [class~='dark:bg-slate-700'],
      .dark #theme-xuhome [class~='dark:bg-slate-800'] {
        background-color: var(--xuhome-console-card) !important;
      }
      .dark #theme-xuhome [class~='dark:bg-slate-900/85'] {
        background-color: color-mix(
          in srgb,
          var(--xuhome-console-bg) 85%,
          transparent
        ) !important;
      }
      #theme-xuhome [class~='bg-[#faf8f5]/55'] {
        background-color: color-mix(
          in srgb,
          var(--xuhome-console-bg) 55%,
          transparent
        ) !important;
      }
      #theme-xuhome [class~='hover:bg-[#0284c7]']:hover {
        background-color: var(--xuhome-console-primary) !important;
        color: var(--xuhome-on-primary) !important;
      }
      #theme-xuhome [class~='hover:bg-[#0ea5e9]']:hover {
        background-color: var(--xuhome-console-primary-hover) !important;
        color: var(--xuhome-on-primary-hover) !important;
      }
      #theme-xuhome [class~='hover:bg-[#fde68a]']:hover {
        background-color: var(--xuhome-accent) !important;
        color: var(--xuhome-on-accent) !important;
      }
      #theme-xuhome [class~='hover:text-[#0284c7]']:hover,
      #theme-xuhome .group:hover [class~='group-hover:text-[#0284c7]'] {
        color: var(--xuhome-console-primary) !important;
      }
      #theme-xuhome .group:hover [class~='group-hover:text-[#0ea5e9]'] {
        color: var(--xuhome-console-primary-hover) !important;
      }
      #theme-xuhome [class~='shadow-[1px_1px_0px_0px_#0284c7]'] {
        --tw-shadow: 1px 1px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='shadow-[2px_2px_0px_0px_#0284c7]'] {
        --tw-shadow: 2px 2px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='shadow-[3px_3px_0px_0px_#0284c7]'] {
        --tw-shadow: 3px 3px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='shadow-[4px_4px_0px_0px_#0284c7]'] {
        --tw-shadow: 4px 4px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='hover:shadow-[4px_4px_0px_0px_#0284c7]']:hover {
        --tw-shadow: 4px 4px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='hover:shadow-[6px_6px_0px_0px_#0284c7]']:hover {
        --tw-shadow: 6px 6px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='active:shadow-[1px_1px_0px_0px_#0284c7]']:active {
        --tw-shadow: 1px 1px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='active:shadow-[2px_2px_0px_0px_#0284c7]']:active {
        --tw-shadow: 2px 2px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='shadow-[0px_4px_0px_0px_#0284c7]'] {
        --tw-shadow: 0 4px 0 0 var(--xuhome-console-border);
      }
      #theme-xuhome [class~='shadow-[0px_4px_0px_0px_rgba(2,132,199,0.2)]'] {
        --tw-shadow: 0 4px 0 0
          color-mix(in srgb, var(--xuhome-console-border) 20%, transparent);
      }

      #theme-xuhome ::selection {
        background: var(--xuhome-accent);
        color: var(--xuhome-on-accent);
      }

      #theme-xuhome #article-wrapper,
      #theme-xuhome #notion-article {
        font-size: 1rem;
        line-height: 1.85;
      }

      #theme-xuhome #notion-article h1 {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 1.5em 0 0.5em;
      }
      #theme-xuhome #notion-article h2 {
        font-size: 1.35rem;
        font-weight: 800;
        margin: 1.4em 0 0.4em;
        border-bottom: 3px solid var(--xuhome-primary);
        padding-bottom: 0.3em;
      }
      #theme-xuhome #notion-article h3 {
        font-size: 1.15rem;
        font-weight: 800;
        margin: 1.2em 0 0.3em;
      }

      #theme-xuhome #notion-article a {
        color: var(--xuhome-primary);
        font-weight: 700;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }
      #theme-xuhome #notion-article a:hover {
        color: var(--xuhome-primary-hover);
      }

      #theme-xuhome #notion-article code {
        font-size: 0.875em;
        border-radius: 0.125rem;
        padding: 0.2em 0.4em;
        background: var(--xuhome-accent);
        color: var(--xuhome-on-accent);
        font-weight: 600;
        font-family:
          ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
      }
      .dark #theme-xuhome #notion-article code {
        background: var(--xuhome-console-card);
        color: var(--xuhome-accent);
      }

      #theme-xuhome #notion-article pre {
        border-radius: 0.125rem;
        padding: 16px;
        overflow-x: auto;
        background: var(--xuhome-console-card);
        border: 2px solid var(--xuhome-primary);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .dark #theme-xuhome #notion-article pre {
        background: var(--xuhome-surface-dark);
      }

      #theme-xuhome #notion-article blockquote {
        border-left: 4px solid var(--xuhome-accent);
        padding: 0.5em 1em;
        margin: 1em 0;
        background: color-mix(in srgb, var(--xuhome-accent) 10%, transparent);
        font-weight: 500;
      }
      .dark #theme-xuhome #notion-article blockquote {
        background: color-mix(in srgb, var(--xuhome-accent) 5%, transparent);
      }

      #theme-xuhome #notion-article hr {
        border: none;
        height: 3px;
        background: var(--xuhome-primary);
        margin: 2em 0;
      }

      #theme-xuhome #notion-article table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      #theme-xuhome #notion-article th,
      #theme-xuhome #notion-article td {
        padding: 8px 12px;
        border: 2px solid var(--xuhome-primary);
      }
      #theme-xuhome #notion-article th {
        font-weight: 800;
        background: var(--xuhome-accent);
        color: var(--xuhome-on-accent);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .dark #theme-xuhome #notion-article th {
        background: var(--xuhome-console-card);
        color: var(--xuhome-accent);
        border-color: var(--xuhome-primary);
      }

      #theme-xuhome #notion-article img {
        max-width: 100%;
        border-radius: 0.125rem;
        border: 3px solid var(--xuhome-primary);
      }

      #theme-xuhome #notion-article .notion-bookmark {
        border: 2px solid var(--xuhome-primary);
        border-radius: 0.125rem;
        box-shadow: 4px 4px 0 0 var(--xuhome-primary);
      }
      .dark #theme-xuhome #notion-article .notion-bookmark {
        background: var(--xuhome-surface-dark);
      }
      #theme-xuhome #notion-article .notion-bookmark a {
        font-weight: 600;
        text-decoration: none;
      }

      #theme-xuhome ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      #theme-xuhome ::-webkit-scrollbar-track {
        background: var(--xuhome-console-card);
      }
      #theme-xuhome ::-webkit-scrollbar-thumb {
        background: var(--xuhome-primary);
        border-radius: 0;
      }
      #theme-xuhome ::-webkit-scrollbar-thumb:hover {
        background: var(--xuhome-primary-hover);
      }
      .dark #theme-xuhome ::-webkit-scrollbar-track {
        background: var(--xuhome-surface-dark);
      }

      ${themeConsoleStyle('xuhome', CONFIG)}
    `}</style>
  )
}

export { Style }

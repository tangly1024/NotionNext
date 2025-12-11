export const AuroraStyles = () => (
  <style jsx global>{`
    :root {
      --aurora-bg: #ffffff;
      --aurora-text: #0b0f1a;
      --aurora-muted: #556070;
      --aurora-brand: #1e6fff;
      --aurora-brand-ink: #1149aa;
      --aurora-card: #f5f7fb;
      --aurora-border: #e7ebf3;
      --aurora-shadow: 0 6px 20px rgba(17, 24, 39, 0.08);
    }

    [data-aurora-theme='dark'] {
      --aurora-bg: #0b0f1a;
      --aurora-text: #e6eaf2;
      --aurora-muted: #a9b3c3;
      --aurora-brand: #6aa5ff;
      --aurora-brand-ink: #9ec0ff;
      --aurora-card: #121826;
      --aurora-border: #1c2433;
      --aurora-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    #theme-aurora {
      min-height: 100vh;
      background: var(--aurora-bg);
      color: var(--aurora-text);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
    }

    .aurora-skip-link {
      position: absolute;
      left: -999px;
      top: -999px;
      background: var(--aurora-brand);
      color: #fff;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      z-index: 1000;
    }

    .aurora-skip-link:focus {
      left: 1rem;
      top: 1rem;
    }

    .aurora-header {
      position: sticky;
      top: 0;
      z-index: 900;
      backdrop-filter: saturate(180%) blur(10px);
      transition: box-shadow 0.3s ease, border-color 0.3s ease,
        background-color 0.3s ease;
      background: color-mix(in oklab, var(--aurora-bg) 85%, transparent);
      border-bottom: 1px solid transparent;
    }

    .aurora-header.is-scrolled {
      box-shadow: var(--aurora-shadow);
      border-color: var(--aurora-border);
      background: color-mix(in oklab, var(--aurora-bg) 92%, transparent);
    }

    .aurora-nav-wrap {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .aurora-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .aurora-brand-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--aurora-brand);
      box-shadow: var(--aurora-shadow);
    }

    .aurora-brand-name {
      font-weight: 700;
    }

    .aurora-brand-role {
      font-size: 0.9rem;
      color: var(--aurora-muted);
    }

    .aurora-nav {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .aurora-nav-list {
      list-style: none;
      display: flex;
      gap: 0.35rem;
      padding: 0;
      margin: 0;
    }

    .aurora-nav-link {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.75rem;
      border-radius: 0.6rem;
      font-weight: 600;
      color: var(--aurora-text);
      text-decoration: none;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .aurora-nav-link:hover {
      background: var(--aurora-card);
    }

    .aurora-nav-link[aria-current='page'] {
      background: var(--aurora-brand);
      color: #fff;
    }

    .aurora-nav-actions {
      display: flex;
      gap: 0.5rem;
      margin-left: 0.5rem;
    }

    .aurora-btn {
      border: 1px solid var(--aurora-border);
      background: var(--aurora-bg);
      color: var(--aurora-text);
      padding: 0.45rem 0.75rem;
      border-radius: 0.6rem;
      font-weight: 600;
      cursor: pointer;
      transition: box-shadow 0.2s ease, background 0.2s ease;
    }

    .aurora-btn:hover {
      box-shadow: var(--aurora-shadow);
    }

    .aurora-btn-primary {
      background: var(--aurora-brand);
      color: #fff;
      border-color: transparent;
    }

    .aurora-btn-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .aurora-menu-toggle {
      display: none;
    }

    .aurora-mobile-menu {
      display: none;
      border-top: 1px solid var(--aurora-border);
      background: var(--aurora-bg);
    }

    .aurora-mobile-menu.open {
      display: block;
    }

    .aurora-mobile-menu ul {
      list-style: none;
      margin: 0;
      padding: 0.5rem 1rem 1rem;
    }

    .aurora-mobile-menu a {
      display: block;
      padding: 0.75rem;
      border-radius: 0.6rem;
      color: var(--aurora-text);
      text-decoration: none;
    }

    .aurora-mobile-menu a:hover {
      background: var(--aurora-card);
    }

    main#aurora-main {
      padding-top: 1rem;
    }

    .aurora-hero {
      max-width: 1120px;
      margin: 0 auto;
      padding: 3rem 1rem 2rem;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
      align-items: center;
    }

    .aurora-hero h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin: 0.5rem 0;
    }

    .aurora-subtitle {
      color: var(--aurora-muted);
      font-size: 1.05rem;
    }

    .aurora-cta-group {
      margin-top: 1.25rem;
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .aurora-hero-card {
      background: var(--aurora-card);
      border: 1px solid var(--aurora-border);
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: var(--aurora-shadow);
    }

    .aurora-hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.9rem;
    }

    .aurora-tag {
      font-size: 0.85rem;
      padding: 0.25rem 0.55rem;
      border-radius: 0.5rem;
      background: rgba(30, 111, 255, 0.08);
      color: var(--aurora-brand-ink);
      border: 1px solid color-mix(in oklab, var(--aurora-brand) 45%, var(--aurora-border));
    }

    .aurora-quick-grid {
      max-width: 1120px;
      margin: 0 auto;
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1rem;
    }

    .aurora-quick-item {
      background: var(--aurora-card);
      border: 1px solid var(--aurora-border);
      border-radius: 0.9rem;
      padding: 1rem;
      text-decoration: none;
      color: var(--aurora-text);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .aurora-quick-item:hover {
      box-shadow: var(--aurora-shadow);
      transform: translateY(-2px);
    }

    .aurora-quick-title {
      font-weight: 700;
    }

    .aurora-quick-desc {
      font-size: 0.92rem;
      color: var(--aurora-muted);
    }

    .aurora-section {
      max-width: 1120px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .aurora-section h2 {
      font-size: 1.6rem;
      margin: 0 0 1rem;
    }

    .aurora-news-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .aurora-news-card {
      background: var(--aurora-card);
      border: 1px solid var(--aurora-border);
      border-radius: 1rem;
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      min-height: 200px;
    }

    .aurora-news-card time {
      color: var(--aurora-muted);
      font-size: 0.9rem;
    }

    .aurora-news-card a {
      color: var(--aurora-brand);
      font-weight: 600;
      text-decoration: none;
    }

    .aurora-news-card a:hover {
      text-decoration: underline;
    }

    .aurora-content-shell {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1rem 4rem;
    }

    .aurora-card-surface {
      background: var(--aurora-card);
      border: 1px solid var(--aurora-border);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: var(--aurora-shadow);
    }

    .aurora-footer {
      border-top: 1px solid var(--aurora-border);
      padding: 2rem 1rem 3rem;
      color: var(--aurora-muted);
      margin-top: 1rem;
    }

    .aurora-footer-wrap {
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .aurora-footer-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .aurora-footer-links a {
      text-decoration: none;
      color: var(--aurora-muted);
    }

    .aurora-footer-links a:hover {
      color: var(--aurora-brand);
    }

    @media (max-width: 1024px) {
      .aurora-hero {
        grid-template-columns: 1fr;
      }

      .aurora-quick-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .aurora-news-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 860px) {
      .aurora-nav {
        display: none;
      }

      .aurora-menu-toggle {
        display: inline-flex;
      }
    }

    @media (max-width: 640px) {
      .aurora-quick-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .aurora-news-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
)

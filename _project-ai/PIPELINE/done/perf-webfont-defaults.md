# Task: Reduce default font loading cost

```yaml
id: perf-webfont-defaults
type: performance-fix
goal: Reduce default external font requests reported by WebPageTest without removing user opt-in support for custom web fonts.
priority: high
inputs:
  - User WebPageTest screenshots show many `fonts.gstatic.com/notoserifsc/...` requests and slow FCP/LCP.
  - Current default `conf/font.config.js` loads Bitter, Noto Sans SC, and Noto Serif SC through Google Fonts.
  - `components/SEO.js` adds Google font preconnect whenever any FONT_URL exists.
deliverables:
  - `conf/font.config.js`
  - `components/SEO.js`
  - Targeted Jest coverage for the changed behavior.
acceptance:
  - Default `FONT_URL` no longer pulls large Chinese Google web fonts.
  - Existing users can still opt in through `NEXT_PUBLIC_FONT_URL` or Notion config.
  - Google Fonts DNS/preconnect tags are emitted only when a configured font URL actually targets Google Fonts.
  - Music player behavior is not changed unless the implementation proves it is loaded by default.
  - Targeted tests fail before the code change and pass after the code change.
limits:
  max_turns: 1
  max_retries: 1
  max_duration_minutes: 20
  max_cost_yuan: 0
blocked_format:
  reason:
  required_input:
  retry_scope:
```

## Result

```yaml
status: done
task_id: perf-webfont-defaults
deliverables:
  - conf/font.config.js
  - components/SEO.js
  - __tests__/components/SEO.test.js
  - docs/user-guide/config/notion-next-web-font.md
  - docs/user-guide/config/index.md
  - docs/user-guide/changelog/latest.md
checks:
  - "RED: yarn test __tests__/components/SEO.test.js --runInBand failed as expected: non-Google FONT_URL still emitted fonts.googleapis.com hint; default config still included Noto Sans SC / Noto Serif SC Google URLs."
  - "GREEN: yarn test __tests__/components/SEO.test.js --runInBand passed: 6 tests, 1 suite."
notes:
  - "Default FONT_URL is now empty unless NEXT_PUBLIC_FONT_URL is set; Notion config still overrides through siteConfig('FONT_URL')."
  - "SEO Google Fonts dns-prefetch/preconnect now render only when a configured FONT_URL host is fonts.googleapis.com."
  - "Music player was not changed; current default MUSIC_PLAYER is false and ExternalPlugins only loads MusicPlayer when that config is truthy."
residual_risk:
  - "Sites relying on the old default Bitter/Noto Google webfonts will need explicit NEXT_PUBLIC_FONT_URL or Notion_Config FONT_URL opt-in."
blocked: none
```

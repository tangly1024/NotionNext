# Review: perf-webfont-defaults

```yaml
task_id: perf-webfont-defaults
status: accepted
reviewer: root-agent
reviewed_at: 2026-09-01
artifacts:
  - conf/font.config.js
  - components/SEO.js
  - __tests__/components/SEO.test.js
  - docs/user-guide/config/notion-next-web-font.md
  - docs/user-guide/config/index.md
  - docs/user-guide/changelog/latest.md
  - _project-ai/PIPELINE/done/perf-webfont-defaults.md
checks:
  - "Reviewed git diff for the scoped files."
  - "Ran: yarn test __tests__/components/SEO.test.js --runInBand"
  - "Ran: git diff --check -- conf/font.config.js components/SEO.js __tests__/components/SEO.test.js docs/user-guide/config/notion-next-web-font.md docs/user-guide/config/index.md docs/user-guide/changelog/latest.md _project-ai/PIPELINE/done/perf-webfont-defaults.md _project-ai/REVIEWS/perf-webfont-defaults-review.md"
result:
  - "Default FONT_URL no longer loads Google Chinese web fonts."
  - "Google Fonts resource hints now depend on an actual fonts.googleapis.com URL."
  - "NEXT_PUBLIC_FONT_URL opt-in is covered by Jest."
  - "User-facing docs and latest changelog describe the default system-font behavior and Web Font opt-in path."
  - "Music player was not changed because MUSIC_PLAYER remains false by default."
residual_risk:
  - "Users who relied on old default Google web fonts need explicit FONT_URL opt-in."
```

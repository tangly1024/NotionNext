# SEO Sitemap Follow-up

Last updated: 2026-04-15

## What changed

- Added high-intent SEO enhancement coverage in [lib/seo/postEnhancements.js](/Users/Yuki/NotionNext/lib/seo/postEnhancements.js).
- Hardened [pages/sitemap.xml.js](/Users/Yuki/NotionNext/pages/sitemap.xml.js) so sitemap output excludes:
  - known broken slugs that canonical back to home
  - invalid Notion-ID-like slug tails
- Added a deployment verification script:
  - `npm run seo:sitemap-audit`

## Current known-good behavior

- Valid article slugs like `article/notebooklm` and `article/WildGaussians` should remain in sitemap.
- Known broken slugs like `article/mi-gpt` and `article/Pygwalker` should be excluded.
- UUID-like slug `article/15400092-b977-80f2-9d98-cc2146bffd41` is currently still a valid live page and should not be removed.

## Deploy checklist

1. Deploy the current `NotionNext` branch.
2. Wait for production to finish.
3. Run:

```bash
npm run seo:sitemap-audit
```

4. Confirm the output no longer reports:
  - `article/mi-gpt`
  - `article/Pygwalker`
  - the known broken UUID-like slugs that canonical to home

## What to inspect after deploy

### 1. Sitemap quality

Check:

```bash
curl -L https://www.charliiai.com/sitemap.xml
```

Expected:

- broken slugs removed
- valid article URLs still present

### 2. Canonical consistency

Check a few known pages:

```bash
curl -L https://www.charliiai.com/article/notebooklm
curl -L https://www.charliiai.com/article/WildGaussians
curl -L https://www.charliiai.com/article/mi-gpt
```

Expected:

- real article pages canonical to themselves
- broken pages should no longer appear in sitemap

### 3. GSC observation window

After deploy, wait 7-14 days and focus on:

- pages with impressions but low CTR
- pages with improved indexing after sitemap cleanup
- whether impressions concentrate on the newly enhanced article pages

## Remaining cleanup candidates

These still exist in sitemap diff history and may be worth reviewing later, but should not be removed blindly without checking page behavior first:

- `article/openai-sora-shutdown-10yi-lesson`
- `article/jilu`
- `article/chuhaihegui`
- `article/Genie2`
- `article/Xlearn`
- `article/YLB`
- `article/CHIEF`
- `article/PDFMathTranslate`
- `article/AIreport`
- `article/PortraitGen`

## Priority after deploy

1. Verify sitemap cleanup worked in production.
2. Pull real GSC impression data.
3. Only then keep refining titles/descriptions on pages that already have search exposure.

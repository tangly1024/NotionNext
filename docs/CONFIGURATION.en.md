# Configuration System

[中文](./CONFIGURATION.md)

## Sources and priority

For keys with same name, priority is:

1. Notion Config page
2. Environment variables
3. Local files (`blog.config.js` / `conf/*.config.js`)

## Recommended practice

- Split large config sections into `conf/*.config.js`
- Keep `blog.config.js` mostly as aggregator
- For each new config key, document:
  - default value
  - env var name
  - Notion Config same-name key

## High-risk open-source pitfalls

### 1) Do not commit personal configs

Usually should never be committed:

- `.env.local`
- private token/key content
- personal ad/analytics IDs as defaults
- personal-only menu/theme defaults

### 2) Avoid unrelated config edits

If task is a small bug fix, do not casually reformat/sort many config files.

### 3) Document new global configs

At minimum update:

- comment in config file
- docs or PR description usage notes


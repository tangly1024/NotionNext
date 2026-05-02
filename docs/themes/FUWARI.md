# Fuwari Theme (NotionNext)

This is the NotionNext port of the Fuwari visual style.

## Upstream Reference

- Source project: [saicaca/fuwari](https://github.com/saicaca/fuwari)
- Demo site: [fuwari.vercel.app](https://fuwari.vercel.app/)

## Design Goal

- Keep Fuwari's card-based visual language and light interaction feeling.
- Stay fully compatible with NotionNext data flow and feature modules.

## Key Features in This Port

- Data-driven menu (`customNav`, `CUSTOM_MENU + customMenu`)
- Full-width Hero with Notion cover priority (`siteInfo.pageCover`)
- Left sidebar + right content layout (desktop default)
- Post list dual layout (with-cover / without-cover)
- Right-side readmore action rail
- Profile card + social links row (`CONTACT_*` keys)
- Announcement block, TOC, analytics, ads, plugin slots
- Global dark mode integration via NotionNext context

## Online Theme Color Picker

The top-right palette button opens a floating hue panel (Fuwari-like UX):

- Real-time color preview for key theme elements
- Persisted in browser local storage
- Operators can copy hue/hex and write default into config

Related config keys:

- `FUWARI_WIDGET_THEME_COLOR_SWITCHER`
- `FUWARI_THEME_COLOR_FIXED`
- `FUWARI_THEME_COLOR_HUE`

## Important Config Keys

- Layout/menu:
  - `FUWARI_MENU_*`
  - `FUWARI_PROFILE_PATH`
- Hero:
  - `FUWARI_HERO_ENABLE`
  - `FUWARI_HERO_BG_IMAGE`
  - `FUWARI_HERO_CREDIT_TEXT`
  - `FUWARI_HERO_CREDIT_LINK`
- Post list:
  - `FUWARI_POST_LIST_*`
- Article:
  - `FUWARI_ARTICLE_*`
- Sidebar widgets:
  - `FUWARI_WIDGET_*`

## Migration Notes

For migration guidance and pitfalls, see:

- `docs/THEME_MIGRATION_GUIDE.md`
- `docs/THEME_MIGRATION_GUIDE.zh-CN.md`


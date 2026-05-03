# Endspace Theme (NotionNext)

Endspace is a NotionNext theme inspired by the visual language of *Arknights: Endfield*’s official site, maintained by the community. Upstream repository: [cloud-oc/endspace](https://github.com/cloud-oc/endspace). Tracking issue: [#3990](https://github.com/tangly1024/NotionNext/issues/3990).

**Original author / upstream**: [@cloud-oc](https://github.com/cloud-oc) ([cloud-oc/endspace](https://github.com/cloud-oc/endspace)).

## Enable

1. Install dependencies at the repo root (`yarn install`):
   - `@tabler/icons-react`
   - `remixicon-react`
2. Set `THEME` / `NEXT_PUBLIC_THEME` to `endspace`.
3. Tune `ENDSPACE_*` keys in `themes/endspace/config.js` as needed.

## Features

- Industrial sci-fi layout, optional immersive loading sequence.
- Desktop side rail + mobile bottom navigation; includes an integrated music player widget.
- Article pages wrap `NotionPage` inside `#article-wrapper`.
- Optional `NEST` animation: `#__nest` is the mount point used by `public/js/nest.js` (this port sets nest attributes via `ref` + `useEffect` to avoid invalid React DOM props).

## License

Upstream theme is from [cloud-oc/endspace](https://github.com/cloud-oc/endspace) and is licensed under **Apache-2.0**. The NotionNext repository remains primarily **MIT**; if you redistribute this theme’s code, comply with Apache-2.0 attribution/notice/reciprocal terms (full text: <https://www.apache.org/licenses/LICENSE-2.0>).

## Preview asset

Theme preview: `public/images/themes-preview/endspace.webp` (generated from `endspace.png` in the same folder). After updating the PNG, run `yarn perf:compress-theme-previews` to regenerate WebP.

## Maintenance

Follow the [Theme migration guide](../THEME_MIGRATION_GUIDE.md) for data/prop conventions (menus, dark mode, comments, TOC, etc.). Upstream ships the theme as a single package on the `theme` branch—prefer directory-level diffs when syncing updates.

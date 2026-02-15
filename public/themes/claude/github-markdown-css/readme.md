# github-markdown-css

> The minimal amount of CSS to replicate the GitHub Markdown style

**The CSS is generated. Contributions should go to [this repo](https://github.com/sindresorhus/generate-github-markdown-css).**

[<img src="https://cloud.githubusercontent.com/assets/170270/5219062/f22a978c-7685-11e4-8316-af25b6c89bc0.png" width="300">](http://sindresorhus.com/github-markdown-css)

## [Demo](https://sindresorhus.com/github-markdown-css)

## Install

Download [manually](https://raw.githubusercontent.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css), from [CDNJS](https://cdnjs.com/libraries/github-markdown-css), or with npm:

```sh
npm install github-markdown-css
```

## Usage

Import the `github-markdown.css` file and add a `markdown-body` class to the container of your rendered Markdown and set a width for it. GitHub uses `980px` width and `45px` padding, and `15px` padding for mobile.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="github-markdown.css">
<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>
<article class="markdown-body">
	<h1>Unicorns</h1>
	<p>All the things</p>
</article>
```

You can use [GitHub's `/markdown` API](https://docs.github.com/en/free-pro-team@latest/rest/reference/markdown) to turn Markdown into the HTML that GitHub generates, which works well with the CSS in this repo. Other Markdown parsers will mostly work with these styles too. To mimic how GitHub highlights code, you can use [`starry-night`](https://github.com/wooorm/starry-night) with your Markdown parser of choice.

There are 7 themes provided in this package:

- **github-markdown.css**: (default) Automatically switches between light and dark through [`@media (prefers-color-scheme)`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme).
- **github-markdown-light.css**: Light-only.
- **github-markdown-dark.css**: Dark-only.
- **github-markdown-dark-dimmed.css**: Dark dimmed.
- **github-markdown-dark-high-contrast.css**: Dark high contrast.
- **github-markdown-dark-colorblind.css**: Dark Protanopia & Deuteranopia.
- **github-markdown-light-colorblind.css**: Light Protanopia & Deuteranopia.

## How

See [`generate-github-markdown-css`](https://github.com/sindresorhus/generate-github-markdown-css) for how it's generated and ability to generate your own.

## Troubleshooting

If you encounter styling issues, like tables in dark mode rendering their fonts in black, the browser might uses [quirks mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode) by accident.

To avoid quirks mode, always include a doctype at the top of your page.

```html
<!doctype html>
<html lang="en"><head></head><body></body></html>
```

## Dev

Run `npm run make` to update the CSS.

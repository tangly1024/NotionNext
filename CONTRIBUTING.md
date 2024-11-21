# Contributing

- [Setup](#setup)
- [Creating new themes](#creating-new-themes)
- [Adding localizations](#adding-localizations)
- [Environment Variables](#environment-variables)

Thanks for considering to contribute!

## Setup

To contribute to NotionNext, follow these steps:

1. [Fork][fork] the repository to your GitHub account.
2. Clone the repository to your device (or use something like Codespaces).
3. Create a new branch in the repository.
4. Make your modifications.
5. Commit your modifications and push the branch.
6. [Create a PR][pr] from the branch in your fork to NotionNext' `main` branch.

This project is built with [Next.js][next.js] and `yarn` as the package manager.
Here are some commands that you can use:

- `yarn`: install dependencies
- `yarn dev`: compile and hot-reload for development
- `yarn build`: compile and minify for production
- `yarn start`: serve the compiled build in production mode

## Creating new themes

If you want to submit your custom theme to NotionNext, copy a new folder in
[`themes`][themes-dir] from [`example`][example]. The folder name  will be the
theme's key. 

## Adding localizations

If your language is not yet supported by NotionNext, please contribute a
localization! Follow these steps to add a new localization:

1. Copy one of the [en-US.js][en-US.js] in [lang-dir][lang-dir] and rename the new
   directory into your language's code ( e.g. `zh-CN.js`).
2. Start translating the strings.
3. Add your language config to [lang.js][lang.js]. 
4. [Create a PR][pr] with your localization updates.

## Environment Variables

NotionNext uses environment variables for configuration. To set up your development environment:

1. Copy `.env.example` to `.env.local`
2. Fill in the required values in `.env.local`
3. Never commit `.env.local` to version control

The configuration priority is:
1. Notion Config Table (highest)
2. Environment Variables
3. blog.config.js (lowest)

[fork]: https://github.com/tangly1024/NotionNext/fork
[pr]: https://github.com/tangly1024/NotionNext/compare
[next.js]: https://github.com/vercel/next.js
[themes-dir]: themes
[example]: themes/example
[lang-dir]: lib/lang
[en-US.js]: lib/lang/en-US.js
[lang.js]: lib/lang.js

# ChatGPT-API Demo

English | [简体中文](./README.zh-CN.md)

A demo repo based on [OpenAI GPT-3.5 Turbo API.](https://platform.openai.com/docs/guides/chat)

**🍿 Live preview**: https://chatgpt.ddiu.me

> ⚠️ Notice: Our API Key limit has been exhausted. So the demo site is not available now.

![chat-logo](https://cdn.staticaly.com/gh/yzh990918/static@master/chat-logo.webp)
 


## Running Locally

### Pre environment
1. **Node**: Check that both your development environment and deployment environment are using `Node v18` or later. You can use [nvm](https://github.com/nvm-sh/nvm) to manage multiple `node` versions locally。
   ```bash
    node -v
   ```
2. **PNPM**: We recommend using [pnpm](https://pnpm.io/) to manage dependencies. If you have never installed pnpm, you can install it with the following command:
   ```bash
    npm i -g pnpm
   ```
3. **OPENAI_API_KEY**: Before running this application, you need to obtain the API key from OpenAI. You can register the API key at [https://beta.openai.com/signup](https://beta.openai.com/signup).

### Getting Started

1. Install dependencies
   ```bash
    pnpm install
   ```
2. Copy the `.env.example` file, then rename it to `.env`, and add your [OpenAI API key](https://platform.openai.com/account/api-keys) to the `.env` file.
   ```bash
    OPENAI_API_KEY=sk-xxx...
   ```
3. Run the application, the local project runs on `http://localhost:3000/`
   ```bash
    pnpm run dev
   ```

## Deploy

### Deploy With Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fddiu8081%2Fchatgpt-demo&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.4wzfb79qt7k0.webp)


### Deploy With Netlify

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ddiu8081/chatgpt-demo#OPENAI_API_KEY=&HTTPS_PROXY=&OPENAI_API_BASE_URL=&HEAD_SCRIPTS=&SECRET_KEY=)

**Step-by-step deployment tutorial:**

1. [Fork](https://github.com/ddiu8081/chatgpt-demo/fork) this project，Go to [https://app.netlify.com/start](https://app.netlify.com/start) new Site, select the project you `forked` done, and connect it with your `GitHub` account.

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.3nlt4hgzb16o.webp)

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230310/image.5fhfouap270g.webp)


2. Select the branch you want to deploy, then configure environment variables in the project settings.

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230311/image.gfs9lx8c854.webp)

3. Select the default build command and output directory, Click the `Deploy Site` button to start deploying the site。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230311/image.4jky9e1wbojk.webp)


### Deploy with Docker
```bash
# build
docker-compose build .
# run
docker-compose up -d
# stop
docker-compose down
```


### Deploy on more servers

Please refer to the official deployment documentation：https://docs.astro.build/en/guides/deploy

## Environment Variables

You can control the website through environment variables.

| Name | Description | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Your API Key for OpenAI. | `null` |
| `HTTPS_PROXY` | Provide proxy for OpenAI API. e.g. `http://127.0.0.1:7890` | `null` |
| `OPENAI_API_BASE_URL` | Custom base url for OpenAI API. | `https://api.openai.com` |
| `HEAD_SCRIPTS` | Inject analytics or other scripts before `</head>` of the page | `null` |
| `SECRET_KEY` | Secret string for the project. Use for generating signatures for API calls | `null` |
| `SITE_PASSWORD` | Set password for site. If not set, site will be public | `null` |

## Frequently Asked Questions

Q: TypeError: fetch failed (can't connect to OpenAI Api)

A: Configure environment variables `HTTPS_PROXY`，reference: https://github.com/ddiu8081/chatgpt-demo/issues/34

Q: throw new TypeError(${context} is not a ReadableStream.)

A: The Node version needs to be `v18` or later，reference: https://github.com/ddiu8081/chatgpt-demo/issues/65


## Contributing

This project exists thanks to all those who contributed.

Thank you to all our supporters!🙏

[![img](https://contributors.nn.ci/api?repo=ddiu8081/chatgpt-demo)](https://github.com/ddiu8081/chatgpt-demo/graphs/contributors)

## License

MIT © [ddiu8081](https://github.com/ddiu8081/chatgpt-demo/blob/main/LICENSE)

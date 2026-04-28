import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhSections = {
  eyebrow: 'Curated Tools',
  title: '不是工具堆砌，而是带判断的 AI 工具导航。',
  description:
    '这里更关注哪些工具真的值得进入工作流，适合谁，用在什么环节，以及什么时候不该浪费时间继续试。',
  statLabel: '当前重点',
  statValue: 'AI x Workflow x Output',
  statText: '偏向真实产出，而不是只看热度。',
  primaryCta: { href: '/search', label: '搜索全站内容' },
  secondaryCta: { href: '/cases', label: '看落地案例' },
  tracksTitle: '推荐从这几条线开始看',
  tracks: [
    {
      title: 'Research stack',
      text: '适合做检索、阅读、总结、知识沉淀和长期追踪。'
    },
    {
      title: 'Content stack',
      text: '适合写作、改写、脚本、SEO 和内容复用。'
    },
    {
      title: 'Automation stack',
      text: '适合 Agent、流程串联、批处理和日常提效。'
    }
  ],
  principlesTitle: '我筛工具时会看什么',
  principles: [
    {
      title: '先看是否稳定',
      text: '不是功能越多越好，而是能不能连续使用，能不能稳定地进入生产流程。'
    },
    {
      title: '再看学习成本',
      text: '很多工具在 demo 阶段看起来很聪明，但真正用起来配置复杂、维护成本高。'
    },
    {
      title: '最后看是否真的放大产出',
      text: '如果一个工具不能提升速度、质量或判断力，它就不值得在工作流里占位置。'
    }
  ],
  articleTitle: '真实文章入口',
  articleDescription: '下面这些不是工具清单截图，而是更具体的工具判断与使用场景。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步怎么继续看',
  nextCards: [
    {
      title: '按案例看',
      text: '如果你更关心工具怎么落地，去 /cases 看真实应用场景。',
      href: '/cases',
      label: '进入案例'
    },
    {
      title: '按主题查',
      text: '如果你已经有明确问题，直接用 /search 会更快。',
      href: '/search',
      label: '进入搜索'
    },
    {
      title: '需要合作或咨询',
      text: '如果你想聊 AI 工具选型、内容增长或自动化方案，可以直接发邮件。',
      href: '/contact',
      label: '联系我'
    }
  ]
}

const enSections = {
  eyebrow: 'Curated Tools',
  title: 'An AI tools page with judgment, not just a dump of links.',
  description:
    'This page is built around which tools are actually worth using, who they fit, where they belong in a workflow, and when they are not worth more time.',
  statLabel: 'Current focus',
  statValue: 'AI x Workflow x Output',
  statText: 'Bias toward usable output, not hype.',
  primaryCta: { href: '/search', label: 'Search the site' },
  secondaryCta: { href: '/cases', label: 'See case studies' },
  tracksTitle: 'Best ways to enter this stack',
  tracks: [
    {
      title: 'Research stack',
      text: 'For search, reading, summarization, note systems, and long-term tracking.'
    },
    {
      title: 'Content stack',
      text: 'For writing, rewriting, scripts, SEO, and content repurposing.'
    },
    {
      title: 'Automation stack',
      text: 'For agents, chained workflows, batch execution, and operational leverage.'
    }
  ],
  principlesTitle: 'How the tools are evaluated',
  principles: [
    {
      title: 'Stability first',
      text: 'Feature count is not the point. The question is whether the tool can survive repeated use in a real workflow.'
    },
    {
      title: 'Then learning cost',
      text: 'Many tools look impressive in demos but become expensive in setup, training, and maintenance.'
    },
    {
      title: 'Then output leverage',
      text: 'If a tool does not improve speed, quality, or judgment, it does not deserve a slot in the stack.'
    }
  ],
  articleTitle: 'Real article entry points',
  articleDescription:
    'These are not screenshot lists. They are more specific breakdowns of tool categories, tradeoffs, and use cases.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'Browse by use case',
      text: 'If you care more about implementation than tooling, go to /cases.',
      href: '/cases',
      label: 'Open case studies'
    },
    {
      title: 'Search by problem',
      text: 'If you already know what you need, /search is the fastest path.',
      href: '/search',
      label: 'Open search'
    },
    {
      title: 'Need consulting or collaboration',
      text: 'Reach out directly if you want help with AI tooling, automation, or growth systems.',
      href: '/contact',
      label: 'Contact'
    }
  ]
}

const ToolsPage = ({ toolPosts }) => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enSections : zhSections

  return (
    <main className='pb-20 pt-8 sm:pt-10'>
      <section className='px-5'>
        <div className='mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
          <div className='relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_82%_18%,_rgba(251,191,36,0.18),_transparent_22%),linear-gradient(135deg,_#f8fbff,_#edf5ff_46%,_#f8fafc)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
            <div className='absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-cyan-200/40 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-amber-200/40 blur-3xl' />

            <div className='relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center'>
              <div>
                <div className='inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur'>
                  {content.eyebrow}
                </div>
                <h1 className='mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl'>
                  {content.title}
                </h1>
                <p className='mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
                  {content.description}
                </p>

                <div className='mt-8 flex flex-wrap gap-3'>
                  <a
                    href={content.primaryCta.href}
                    className='inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'>
                    {content.primaryCta.label}
                  </a>
                  <a
                    href={content.secondaryCta.href}
                    className='inline-flex items-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950'>
                    {content.secondaryCta.label}
                  </a>
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur'>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    {content.statLabel}
                  </div>
                  <div className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                    {content.statValue}
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600'>
                    {content.statText}
                  </p>
                </div>

                <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
                  {content.tracks.map(track => (
                    <div
                      key={track.title}
                      className='rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700'>
                        {track.title}
                      </div>
                      <p className='mt-3 text-sm leading-7 text-slate-600'>
                        {track.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-3'>
          <div className='rounded-[30px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300'>
              {content.principlesTitle}
            </div>
            <div className='mt-6 space-y-4'>
              {content.principles.map(item => (
                <div
                  key={item.title}
                  className='rounded-[24px] border border-white/10 bg-white/5 p-4'>
                  <div className='text-lg font-bold'>{item.title}</div>
                  <p className='mt-2 text-sm leading-7 text-slate-300'>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:col-span-2'>
            <div className='grid gap-0 md:grid-cols-[0.92fr_1.08fr]'>
              <img
                src='/images/home.png'
                alt='AI tool workspace'
                className='h-72 w-full object-cover object-center md:h-full'
              />
              <div className='bg-[linear-gradient(135deg,_#f8fafc,_#eef5ff)] p-7 sm:p-8'>
                <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  {content.articleTitle}
                </div>
                <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                  {content.articleDescription}
                </h2>
                <a
                  href={content.articleCta.href}
                  className='mt-6 inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950'>
                  {content.articleCta.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto max-w-6xl rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                Articles
              </div>
              <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                {isEnglish ? 'Selected AI tool posts' : '精选 AI 工具文章'}
              </h2>
            </div>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {toolPosts.map(post => (
              <a
                key={post.href}
                href={post.href}
                className='group rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white'>
                <div className='flex flex-wrap gap-2'>
                  {(post.tags || []).slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className='rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className='mt-4 text-xl font-bold text-slate-950 transition group-hover:text-cyan-700'>
                  {post.title}
                </div>
                {post.summary ? (
                  <p className='mt-3 text-sm leading-7 text-slate-600'>
                    {post.summary}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-3'>
          {content.nextCards.map(card => (
            <div
              key={card.title}
              className='rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {content.nextTitle}
              </div>
              <h3 className='mt-3 text-2xl font-black tracking-tight text-slate-950'>
                {card.title}
              </h3>
              <p className='mt-4 text-sm leading-7 text-slate-600'>
                {card.text}
              </p>
              <a
                href={card.href}
                className='mt-6 inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'>
                {card.label}
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'tools-page', locale })
  const toolPosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        page.tags.includes('AI Tools')
    )
    .slice(0, 8)
    .map(page => ({
      href: page.href,
      title: page.title,
      summary: page.summary,
      tags: page.tags
    }))

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'Tools | CharliiAI' : '工具导航 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'A curated CharliiAI entry page for AI tools, workflows, and practical selection judgment.'
        : 'CharliiAI 的 AI 工具导航页，聚焦工具判断、工作流位置与真实使用价值。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/tools`
  }

  return buildStaticPropsResult({ ...props, toolPosts }, ISR_LIST_REVALIDATE)
}

export default ToolsPage

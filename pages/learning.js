import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Learning Path',
  title: '别把 AI 学习做成资料囤积，先把路径排清楚。',
  description:
    '这页更像一张学习编排图，而不是课程仓库。目标不是让你看得更多，而是让你更快知道应该先补什么、跳过什么，以及什么时候该转向实战。',
  primaryCta: { href: '/basicai', label: '先补基础' },
  secondaryCta: { href: '/cases', label: '看落地案例' },
  trackLabel: '建议顺序',
  trackValue: 'Foundation x Tools x Cases x Research',
  trackText: '先建立判断框架，再上工具，再看案例，最后进入更深的研究与专题。',
  stagesTitle: '四段式学习路径',
  stages: [
    {
      title: 'Stage 01',
      heading: '先补基础概念',
      text: '把模型、提示词、RAG、Agent、自动化这些概念关系先捋顺。'
    },
    {
      title: 'Stage 02',
      heading: '再上手工具',
      text: '开始用真实工具做内容、分析、检索、结构化输出，形成体感。'
    },
    {
      title: 'Stage 03',
      heading: '接着看案例',
      text: '通过工作流案例理解能力边界，而不是只看概念和宣传词。'
    },
    {
      title: 'Stage 04',
      heading: '最后进论文与专题',
      text: '等前面三层稳了，再看论文、专题和技术趋势，理解会更完整。'
    }
  ],
  lanesTitle: '适合的学习目标',
  lanes: [
    {
      title: 'Content & Media',
      text: '适合内容创作者、品牌与媒体操盘者，重点是提效和输出质量。'
    },
    {
      title: 'Operators & Founders',
      text: '适合产品、运营和创业者，重点是判断工具、工作流和业务价值。'
    },
    {
      title: 'Builders & Researchers',
      text: '适合更偏开发或研究的人，重点是技术理解、实验能力与长期跟踪。'
    }
  ],
  standardsTitle: '学习时最容易踩的坑',
  standards: [
    {
      title: '别一上来追最难的',
      text: '如果基础框架没立住，直接看论文和源码通常只会增加混乱。'
    },
    {
      title: '别把收藏当学习',
      text: '收藏很多课程和资料不等于真的理解，真正有效的是形成连续路径。'
    },
    {
      title: '别只学不做',
      text: '每学一段最好立刻放进真实任务里，不然知识会非常快地散掉。'
    }
  ],
  articleTitle: '精选学习入口',
  articleDescription: '先看这些文章，把学习顺序和方向感建立起来。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步建议',
  nextCards: [
    {
      title: '想补底层框架',
      text: '去 /basicai，把最容易混淆的概念先讲明白。',
      href: '/basicai',
      label: '打开 basicai'
    },
    {
      title: '想看真实应用',
      text: '去 /cases，看知识如何进入真实业务和工作流。',
      href: '/cases',
      label: '打开 cases'
    },
    {
      title: '想追研究演化',
      text: '去 /paper，看学习路径最终如何接到论文与趋势判断。',
      href: '/paper',
      label: '打开 paper'
    }
  ]
}

const enContent = {
  eyebrow: 'Learning Path',
  title: 'Do not turn AI learning into content hoarding. Sequence it.',
  description:
    'This page is a learning map, not a course dump. The goal is not to consume more material. It is to know what to learn first, what to skip for now, and when to move from concepts into practice.',
  primaryCta: { href: '/basicai', label: 'Start with foundations' },
  secondaryCta: { href: '/cases', label: 'See real cases' },
  trackLabel: 'Recommended order',
  trackValue: 'Foundation x Tools x Cases x Research',
  trackText: 'Build judgment first, then use tools, then study cases, then go deeper into research and topic tracks.',
  stagesTitle: 'A four-stage path',
  stages: [
    {
      title: 'Stage 01',
      heading: 'Learn the core concepts first',
      text: 'Get the relationships between models, prompting, RAG, agents, and automation clear.'
    },
    {
      title: 'Stage 02',
      heading: 'Use real tools next',
      text: 'Apply tools to writing, analysis, research, and structured output until the tradeoffs feel concrete.'
    },
    {
      title: 'Stage 03',
      heading: 'Study implementation cases',
      text: 'Use workflow cases to understand capability boundaries instead of staying at the marketing layer.'
    },
    {
      title: 'Stage 04',
      heading: 'Then move into papers and deeper tracks',
      text: 'Once the first three layers are stable, research and advanced topics become much easier to absorb.'
    }
  ],
  lanesTitle: 'Useful learning tracks',
  lanes: [
    {
      title: 'Content & Media',
      text: 'For creators, media teams, and brand operators who care about speed and output quality.'
    },
    {
      title: 'Operators & Founders',
      text: 'For product, ops, and founder roles focused on tools, workflows, and business judgment.'
    },
    {
      title: 'Builders & Researchers',
      text: 'For more technical readers who need stronger model understanding, experimentation, and trend tracking.'
    }
  ],
  standardsTitle: 'The common learning mistakes',
  standards: [
    {
      title: 'Do not start with the hardest layer',
      text: 'If the foundation is weak, jumping straight into papers or source code usually creates noise, not clarity.'
    },
    {
      title: 'Do not confuse saving with learning',
      text: 'A large collection of courses and links is not understanding. A clear sequence is much more valuable.'
    },
    {
      title: 'Do not learn without applying',
      text: 'Every stage should be attached to a real task, or the knowledge will fragment quickly.'
    }
  ],
  articleTitle: 'Selected entry points',
  articleDescription: 'Start here to build direction before going wider.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'Need conceptual clarity',
      text: 'Go to /basicai to clean up the core concepts first.',
      href: '/basicai',
      label: 'Open basicai'
    },
    {
      title: 'Need real applications',
      text: 'Go to /cases to see how the ideas enter actual workflows and business tasks.',
      href: '/cases',
      label: 'Open cases'
    },
    {
      title: 'Need deeper research context',
      text: 'Go to /paper to connect this path to papers, research shifts, and longer-term judgment.',
      href: '/paper',
      label: 'Open paper'
    }
  ]
}

const LearningPage = ({ learningPosts }) => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='pb-20 pt-8 sm:pt-10'>
      <section className='px-5'>
        <div className='mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
          <div className='relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_24%),radial-gradient(circle_at_82%_18%,_rgba(34,197,94,0.14),_transparent_22%),linear-gradient(135deg,_#f8fbff,_#eef6ff_44%,_#f8fafc)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
            <div className='absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-sky-200/40 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-200/40 blur-3xl' />

            <div className='relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
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
                    {content.trackLabel}
                  </div>
                  <div className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                    {content.trackValue}
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600'>
                    {content.trackText}
                  </p>
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-2'>
                  {content.stages.map(stage => (
                    <div
                      key={stage.title}
                      className='rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-sm font-semibold uppercase tracking-[0.18em] text-sky-700'>
                        {stage.title}
                      </div>
                      <div className='mt-3 text-lg font-bold text-slate-950'>
                        {stage.heading}
                      </div>
                      <p className='mt-2 text-sm leading-7 text-slate-600'>
                        {stage.text}
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
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]'>
          <div className='rounded-[30px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-sky-300'>
              {content.lanesTitle}
            </div>
            <div className='mt-6 space-y-4'>
              {content.lanes.map(item => (
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

          <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <div className='grid gap-0 md:grid-cols-[1.02fr_0.98fr]'>
              <img
                src='/images/hero-image.png'
                alt='AI learning desk'
                className='h-72 w-full object-cover object-center md:h-full'
              />
              <div className='bg-[linear-gradient(135deg,_#f8fafc,_#eef6ff)] p-7 sm:p-8'>
                <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  {content.standardsTitle}
                </div>
                <div className='mt-6 space-y-4'>
                  {content.standards.map(item => (
                    <div
                      key={item.title}
                      className='rounded-[24px] border border-slate-200 bg-white/80 p-4'>
                      <div className='text-lg font-bold text-slate-950'>
                        {item.title}
                      </div>
                      <p className='mt-2 text-sm leading-7 text-slate-600'>
                        {item.text}
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
        <div className='mx-auto max-w-6xl rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {content.articleTitle}
              </div>
              <h2 className='mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950'>
                {content.articleDescription}
              </h2>
            </div>
            <a
              href={content.articleCta.href}
              className='inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950'>
              {content.articleCta.label}
            </a>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {learningPosts.map(post => (
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
                <div className='mt-4 text-xl font-bold text-slate-950 transition group-hover:text-sky-700'>
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
  const props = await getGlobalData({ from: 'learning-page', locale })
  const learningPosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        ['AI Tools', 'Workflow', 'Research', 'LLM'].some(tag =>
          page.tags.includes(tag)
        )
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
    title: locale === 'en-US' ? 'AI Learning Paths | CharliiAI' : 'AI课程学习 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'A practical AI learning sequence for founders, operators, creators, and technical readers.'
        : '面向不同角色整理 AI 学习顺序、重点方向与更实用的进阶路径。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/learning`
  }

  return buildStaticPropsResult({ ...props, learningPosts }, ISR_LIST_REVALIDATE)
}

export default LearningPage

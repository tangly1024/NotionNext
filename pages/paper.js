import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Research',
  title: '不是追论文热闹，而是追研究变化怎么进入现实。',
  description:
    '这页更关心研究趋势、关键论文和方法演进，最后会怎样影响工具、产品、工作流和判断方式。重点不是堆术语，而是帮你看懂哪些变化真的重要。',
  primaryCta: { href: '/basicai', label: '先补基础' },
  secondaryCta: { href: '/search', label: '搜索具体主题' },
  focusLabel: '研究视角',
  focusValue: 'Papers x Signals x Translation',
  focusText: '研究不该停在摘要，而该落到判断和行动。',
  lanesTitle: '这里主要追哪些线',
  lanes: [
    {
      title: 'Model shifts',
      text: '多模态、Agent、RAG、视频、语音和推理能力的变化。'
    },
    {
      title: 'Tool translation',
      text: '哪些研究能力已经进入产品，哪些还停留在实验阶段。'
    },
    {
      title: 'Reading systems',
      text: '如何筛论文、做笔记、跟踪趋势并形成自己的研究地图。'
    }
  ],
  standardsTitle: '看论文时我更在意什么',
  standards: [
    {
      title: '是不是改变了能力边界',
      text: '真正重要的研究，不是参数更大，而是让某类能力出现质变，或者成本结构发生变化。'
    },
    {
      title: '是否能映射到产品',
      text: '如果一个研究方向短期内无法进入工具和工作流，它的价值判断就要和“可用性”分开看。'
    },
    {
      title: '能不能形成长期跟踪框架',
      text: '单篇论文的热度有限，更重要的是它在一条研究线里处于什么位置。'
    }
  ],
  articleTitle: '精选研究与工作流文章',
  articleDescription: '这些入口更接近“研究变化怎么影响现实使用”，而不是纯学术式摘要。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步建议',
  nextCards: [
    {
      title: '如果想看落地',
      text: '去 /cases，把研究变化和真实工作流串起来看。',
      href: '/cases',
      label: '打开 cases'
    },
    {
      title: '如果想先看工具',
      text: '去 /tools，看哪些研究能力已经变成具体工具和产品选择。',
      href: '/tools',
      label: '打开 tools'
    },
    {
      title: '如果你要系统学习',
      text: '回到 /learning，把阅读顺序和进阶路径搭起来。',
      href: '/learning',
      label: '进入 learning'
    }
  ]
}

const enContent = {
  eyebrow: 'Research',
  title: 'Not just which papers are loud, but which research changes reality.',
  description:
    'This page focuses on research trends, important papers, and method shifts through the lens of how they affect tools, products, workflows, and decision quality. The point is not jargon accumulation. The point is understanding which changes actually matter.',
  primaryCta: { href: '/basicai', label: 'Start with foundations' },
  secondaryCta: { href: '/search', label: 'Search by topic' },
  focusLabel: 'Research lens',
  focusValue: 'Papers x Signals x Translation',
  focusText: 'Research should not stop at summaries. It should turn into judgment and action.',
  lanesTitle: 'The main lines tracked here',
  lanes: [
    {
      title: 'Model shifts',
      text: 'Multimodal systems, agents, RAG, video, voice, and reasoning capability changes.'
    },
    {
      title: 'Tool translation',
      text: 'Which research capabilities have already entered products, and which are still mostly experimental.'
    },
    {
      title: 'Reading systems',
      text: 'How to filter papers, take notes, track trends, and build a research map that lasts.'
    }
  ],
  standardsTitle: 'What matters most in paper tracking',
  standards: [
    {
      title: 'Does it change the capability boundary',
      text: 'The most important research is not just bigger scale. It changes what becomes possible or what becomes cheap enough to matter.'
    },
    {
      title: 'Can it map to products',
      text: 'If a direction cannot enter tools and workflows any time soon, its research value and its practical value should be judged separately.'
    },
    {
      title: 'Does it fit a long-term tracking frame',
      text: 'The popularity of a single paper matters less than where it sits inside a broader research line.'
    }
  ],
  articleTitle: 'Selected research and workflow posts',
  articleDescription:
    'These entry points focus more on how research affects real usage than on academic-style summaries alone.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'If you want implementation',
      text: 'Go to /cases to connect research movement with real workflows.',
      href: '/cases',
      label: 'Open cases'
    },
    {
      title: 'If you want the tool layer',
      text: 'Go to /tools to see which research capabilities have already become concrete product choices.',
      href: '/tools',
      label: 'Open tools'
    },
    {
      title: 'If you want a study path',
      text: 'Go back to /learning to build a more structured reading order.',
      href: '/learning',
      label: 'Open learning'
    }
  ]
}

const PaperPage = ({ paperPosts }) => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

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
                    {content.focusLabel}
                  </div>
                  <div className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                    {content.focusValue}
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600'>
                    {content.focusText}
                  </p>
                </div>

                <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
                  {content.lanes.map(lane => (
                    <div
                      key={lane.title}
                      className='rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700'>
                        {lane.title}
                      </div>
                      <p className='mt-3 text-sm leading-7 text-slate-600'>
                        {lane.text}
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
              {content.standardsTitle}
            </div>
            <div className='mt-6 space-y-4'>
              {content.standards.map(item => (
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
                alt='AI research workspace'
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
          <div>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Articles
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
              {isEnglish ? 'Selected research and signal posts' : '精选研究与信号文章'}
            </h2>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {paperPosts.map(post => (
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
  const props = await getGlobalData({ from: 'paper-page', locale })
  const paperPosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        ['Research', 'Workflow', 'AI Tools', 'LLM'].some(tag =>
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
    title: locale === 'en-US' ? 'AI Papers and Research | CharliiAI' : 'AI+论文 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Notes on AI papers, research trends, and how research translates into products and workflows.'
        : '围绕 AI 论文、研究趋势与论文到产品落地的连接方式整理内容。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/paper`
  }

  return buildStaticPropsResult({ ...props, paperPosts }, ISR_LIST_REVALIDATE)
}

export default PaperPage

import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Case Studies',
  title: '看 AI 怎么落地，不看空泛演示。',
  description:
    '这页更关注 AI 工具、工作流和内容系统进入真实业务后的样子。重点不是“它会不会”，而是“它值不值得接进生产”。',
  primaryCta: { href: '/tools', label: '先看工具导航' },
  secondaryCta: { href: '/search', label: '搜索具体问题' },
  focusLabel: '案例视角',
  focusValue: 'Workflow x Research x Growth',
  focusText: '更偏操盘与执行，不是概念转述。',
  lanesTitle: '重点看的几类案例',
  lanes: [
    {
      title: 'Content systems',
      text: '写作、改写、脚本、SEO、分发和内容复用。'
    },
    {
      title: 'Research systems',
      text: '检索、总结、论文阅读、笔记沉淀和长期跟踪。'
    },
    {
      title: 'Operator systems',
      text: '自动化流程、团队协作、低成本试验和增长执行。'
    }
  ],
  standardsTitle: '我会拿什么标准看案例',
  standards: [
    {
      title: '是不是解决了明确问题',
      text: '如果只是看起来聪明，却不能降低成本、提速度或提判断质量，就不算有效案例。'
    },
    {
      title: '能不能重复执行',
      text: '好案例不是一次性的 demo，而是能被个人或小团队反复拿去用。'
    },
    {
      title: '维护成本是否可接受',
      text: '如果一个方案需要持续堆人力、配置和时间，它很可能不适合真实工作流。'
    }
  ],
  articleTitle: '精选案例文章',
  articleDescription: '下面这些入口更接近“怎么做”和“值不值得做”，不是单纯的资讯摘要。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步建议',
  nextCards: [
    {
      title: '如果你先想看工具',
      text: '回到 /tools，从工具类别和使用位置开始筛。',
      href: '/tools',
      label: '打开 tools'
    },
    {
      title: '如果你想补理论',
      text: '去 /basicai 或 /paper，把方法背后的概念和研究线补齐。',
      href: '/paper',
      label: '进入 paper'
    },
    {
      title: '如果你有具体需求',
      text: '直接联系我，聊 AI 工作流、内容增长、自动化或工具选型。',
      href: '/contact',
      label: '联系我'
    }
  ]
}

const enContent = {
  eyebrow: 'Case Studies',
  title: 'See how AI lands in production, not just in demos.',
  description:
    'This page focuses on what AI tools, workflows, and content systems look like once they enter real operating environments. The question is not whether they can do something. The question is whether they deserve a place in production.',
  primaryCta: { href: '/tools', label: 'Browse tools' },
  secondaryCta: { href: '/search', label: 'Search by problem' },
  focusLabel: 'Case lens',
  focusValue: 'Workflow x Research x Growth',
  focusText: 'Built around execution and operating judgment, not generic commentary.',
  lanesTitle: 'The case types that matter most',
  lanes: [
    {
      title: 'Content systems',
      text: 'Writing, rewriting, scripts, SEO, distribution, and repurposing.'
    },
    {
      title: 'Research systems',
      text: 'Search, summarization, paper reading, note systems, and long-term tracking.'
    },
    {
      title: 'Operator systems',
      text: 'Automation, small-team coordination, low-cost experiments, and growth execution.'
    }
  ],
  standardsTitle: 'How a case gets judged',
  standards: [
    {
      title: 'It should solve a real problem',
      text: 'If it looks intelligent but does not reduce cost, improve speed, or sharpen judgment, it is not a strong case.'
    },
    {
      title: 'It should be repeatable',
      text: 'A good case is not a one-off demo. It should be reusable by a solo operator or a small team.'
    },
    {
      title: 'The maintenance cost should make sense',
      text: 'If a workflow needs constant setup, babysitting, and cleanup, it is probably too expensive to be practical.'
    }
  ],
  articleTitle: 'Selected case-study posts',
  articleDescription:
    'These entry points are closer to how to do it and whether it is worth doing, not generic trend summaries.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'Start from the tool layer',
      text: 'Go back to /tools if you want to filter by tool type and workflow position first.',
      href: '/tools',
      label: 'Open tools'
    },
    {
      title: 'Fill in theory and research',
      text: 'Go to /basicai or /paper if you want the concepts and research behind these workflows.',
      href: '/paper',
      label: 'Open paper'
    },
    {
      title: 'Need help on a real workflow',
      text: 'Reach out directly if you want to discuss AI workflows, content growth, automation, or tool selection.',
      href: '/contact',
      label: 'Contact'
    }
  ]
}

const CasesPage = ({ casePosts }) => {
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
                src='/images/testimonial.jpg'
                alt='AI case study mood'
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
              {isEnglish ? 'Selected workflow and implementation posts' : '精选工作流与落地文章'}
            </h2>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {casePosts.map(post => (
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
  const props = await getGlobalData({ from: 'cases-page', locale })
  const casePosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        ['Workflow', 'Research', 'SEO', 'Automation', 'AI Tools'].some(tag =>
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
    title: locale === 'en-US' ? 'AI Case Studies | CharliiAI' : 'AI案例分享 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Case studies on how AI lands in content, research, growth, and small-team workflows.'
        : '汇总 AI 在内容、研究、增长和小团队工作流中的实际案例与落地思路。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/cases`
  }

  return buildStaticPropsResult({ ...props, casePosts }, ISR_LIST_REVALIDATE)
}

export default CasesPage

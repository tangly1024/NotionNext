import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Foundations',
  title: '先把 AI 概念讲明白，再决定要不要继续深入。',
  description:
    '这页不是为了把人丢进公式和术语海里，而是先帮你建立一个能判断产品、工具和研究变化的基础框架。先理解关系，再谈细节。',
  primaryCta: { href: '/learning', label: '看学习路径' },
  secondaryCta: { href: '/paper', label: '看研究入口' },
  focusLabel: '基础框架',
  focusValue: 'Concepts x Mental Models x Judgment',
  focusText: '先有判断框架，后有更快的学习速度。',
  lanesTitle: '这里主要补哪些基础',
  lanes: [
    {
      title: 'Core concepts',
      text: 'Transformer、Embedding、RAG、Agent、上下文窗口、对齐等。'
    },
    {
      title: 'Model behavior',
      text: '模型是怎么训练、推理、调用工具，以及为什么会出现幻觉。'
    },
    {
      title: 'Product translation',
      text: '同一种底层能力为什么在不同产品里体验完全不同。'
    }
  ],
  standardsTitle: '补基础时最值得注意的事',
  standards: [
    {
      title: '先理解概念之间的关系',
      text: '如果只是背名词，很快就会混乱。基础真正有用的地方，是帮助你看清这些概念怎么连起来。'
    },
    {
      title: '把原理和产品体验对上',
      text: '理论不是为了考试，而是为了让你看到一个工具时，能更快判断它解决了什么问题。'
    },
    {
      title: '别太早陷进细枝末节',
      text: '在没有整体框架前追公式、架构细节和论文实现，通常会让理解更碎。'
    }
  ],
  articleTitle: '精选基础与理解型文章',
  articleDescription: '这些入口更适合建立概念地图，而不是被碎片化信息带着跑。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步建议',
  nextCards: [
    {
      title: '如果你想系统学',
      text: '去 /learning，把基础、工具、论文和实战顺序串起来。',
      href: '/learning',
      label: '打开 learning'
    },
    {
      title: '如果你想看研究',
      text: '去 /paper，看这些基础概念如何继续演化成新的研究方向。',
      href: '/paper',
      label: '打开 paper'
    },
    {
      title: '如果你想看落地',
      text: '去 /cases，看这些概念最后怎么进入真实工作流。',
      href: '/cases',
      label: '打开 cases'
    }
  ]
}

const enContent = {
  eyebrow: 'Foundations',
  title: 'Get the AI concepts clear first, then decide how deep to go.',
  description:
    'This page is not meant to throw you into equations and jargon. It is meant to give you a working mental framework for understanding tools, products, and research shifts. Relationships first, details later.',
  primaryCta: { href: '/learning', label: 'Open learning paths' },
  secondaryCta: { href: '/paper', label: 'Open research' },
  focusLabel: 'Foundation frame',
  focusValue: 'Concepts x Mental Models x Judgment',
  focusText: 'A better mental model is usually the fastest path to better learning.',
  lanesTitle: 'The main foundations covered here',
  lanes: [
    {
      title: 'Core concepts',
      text: 'Transformers, embeddings, RAG, agents, context windows, alignment, and more.'
    },
    {
      title: 'Model behavior',
      text: 'How models are trained, run, use tools, and why hallucinations happen.'
    },
    {
      title: 'Product translation',
      text: 'Why the same underlying capability can feel very different across products.'
    }
  ],
  standardsTitle: 'What matters most when learning the basics',
  standards: [
    {
      title: 'Understand relationships before labels',
      text: 'If you only memorize terms, the map falls apart fast. Foundations matter because they show how the ideas connect.'
    },
    {
      title: 'Match theory to product experience',
      text: 'The point of theory is not testing. It is faster judgment when you encounter a new tool or workflow.'
    },
    {
      title: 'Do not dive into edge detail too early',
      text: 'Chasing equations, architecture details, and implementation too early often fragments understanding.'
    }
  ],
  articleTitle: 'Selected posts for building the map',
  articleDescription:
    'These entry points are better for building conceptual orientation than for reacting to fragmented information.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'If you want a structured path',
      text: 'Go to /learning to connect foundations, tools, papers, and practice in a better order.',
      href: '/learning',
      label: 'Open learning'
    },
    {
      title: 'If you want research depth',
      text: 'Go to /paper to see how these core ideas evolve into newer research directions.',
      href: '/paper',
      label: 'Open paper'
    },
    {
      title: 'If you want implementation',
      text: 'Go to /cases to see how these concepts enter real workflows.',
      href: '/cases',
      label: 'Open cases'
    }
  ]
}

const BasicAiPage = ({ foundationPosts }) => {
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
                src='/images/hero-image.png'
                alt='AI foundations workspace'
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
              {isEnglish ? 'Selected posts for concept building' : '精选基础理解文章'}
            </h2>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {foundationPosts.map(post => (
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
  const props = await getGlobalData({ from: 'basicai-page', locale })
  const foundationPosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        ['Workflow', 'Research', 'LLM', 'AI Tools'].some(tag =>
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
    title: locale === 'en-US' ? 'AI Foundations | CharliiAI' : 'AI理论基础 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'AI foundations for readers who want core concepts, judgment frameworks, and fewer empty buzzwords.'
        : '面向入门和进阶读者整理 AI 基础概念、判断框架与常见误区。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/basicai`
  }

  return buildStaticPropsResult({ ...props, foundationPosts }, ISR_LIST_REVALIDATE)
}

export default BasicAiPage

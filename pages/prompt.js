import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Prompt Design',
  title: '提示词不是咒语，它只是工作流设计的一部分。',
  description:
    '这页想解决的不是“有没有万能模板”，而是让你更快判断：什么时候该补上下文，什么时候该收窄任务，什么时候根本不该再改提示词，而该直接改流程。',
  primaryCta: { href: '/tools', label: '看工具栈' },
  secondaryCta: { href: '/cases', label: '看工作流案例' },
  frameLabel: '核心判断',
  frameValue: 'Goal x Context x Constraints x Output',
  frameText: '大部分提示词问题，不是词不够花，而是任务目标、上下文和输出约束没有讲清楚。',
  principlesTitle: '写提示词最重要的四件事',
  principles: [
    {
      title: '先把目标写清楚',
      text: '模型首先需要知道你要完成什么，而不是先看到一大段背景。'
    },
    {
      title: '上下文只给必要部分',
      text: '上下文越多不一定越好，关键是相关、干净、能帮助模型判断。'
    },
    {
      title: '输出格式要可执行',
      text: '如果结果要进表格、JSON、自动化链路，格式边界必须非常明确。'
    },
    {
      title: '效果不稳就拆任务',
      text: '很多时候不是提示词写得差，而是一个任务本来就不该一次做完。'
    }
  ],
  scenariosTitle: '常见高频场景',
  scenarios: [
    {
      title: 'Writing & Editing',
      text: '适合内容写作、改写、总结、风格统一和结构重组。'
    },
    {
      title: 'Research & Q&A',
      text: '适合文档问答、资料提炼、信息比对和观点整理。'
    },
    {
      title: 'Extraction & Automation',
      text: '适合分类、抽取、改写、结构化输出和自动化流程接入。'
    }
  ],
  warningTitle: '什么时候别再死抠提示词',
  warnings: [
    {
      title: '同一个 prompt 反复补丁',
      text: '如果你一直靠加句子修问题，通常说明任务拆分错了。'
    },
    {
      title: '输入质量本身很差',
      text: '源材料混乱、缺信息时，提示词再漂亮也不会稳定。'
    },
    {
      title: '你真正需要的是工具链',
      text: '检索、记忆、结构化、审核这些能力，很多时候要靠工作流而不是单 prompt。'
    }
  ],
  articleTitle: '精选提示词与工作流文章',
  articleDescription: '这些文章更适合建立“怎么写、怎么接、什么时候别再写”的判断。',
  articleCta: { href: '/archive', label: '查看全部文章' },
  nextTitle: '下一步建议',
  nextCards: [
    {
      title: '想看工具配合',
      text: '去 /tools，看 prompt 如何和工具链组合，而不是孤立使用。',
      href: '/tools',
      label: '打开 tools'
    },
    {
      title: '想看落地案例',
      text: '去 /cases，看真实任务里 prompt 是怎么被嵌进流程的。',
      href: '/cases',
      label: '打开 cases'
    },
    {
      title: '想补底层认知',
      text: '去 /basicai，先理解模型行为和提示词为什么会失灵。',
      href: '/basicai',
      label: '打开 basicai'
    }
  ]
}

const enContent = {
  eyebrow: 'Prompt Design',
  title: 'Prompts are not magic. They are one layer of workflow design.',
  description:
    'This page is not about collecting universal templates. It is about helping you judge when to add context, when to narrow the task, and when the real fix is changing the workflow instead of editing the prompt again.',
  primaryCta: { href: '/tools', label: 'See the tool stack' },
  secondaryCta: { href: '/cases', label: 'See workflow cases' },
  frameLabel: 'Core frame',
  frameValue: 'Goal x Context x Constraints x Output',
  frameText: 'Most prompt failures are not about wording flair. They come from unclear goals, missing context, or weak output constraints.',
  principlesTitle: 'The four things that matter most',
  principles: [
    {
      title: 'State the goal first',
      text: 'The model needs the task objective before it needs a wall of background.'
    },
    {
      title: 'Only provide necessary context',
      text: 'More context is not automatically better. The useful context is relevant, clean, and decision-supporting.'
    },
    {
      title: 'Make the output executable',
      text: 'If the result goes into tables, JSON, or automation, the output boundary has to be explicit.'
    },
    {
      title: 'Split unstable tasks',
      text: 'A weak result often means the task should not be solved in one shot in the first place.'
    }
  ],
  scenariosTitle: 'Common high-frequency scenarios',
  scenarios: [
    {
      title: 'Writing & Editing',
      text: 'For drafting, rewriting, summarizing, voice alignment, and structure cleanup.'
    },
    {
      title: 'Research & Q&A',
      text: 'For document Q&A, synthesis, comparison, and note organization.'
    },
    {
      title: 'Extraction & Automation',
      text: 'For classification, extraction, rewriting, structured output, and workflow integration.'
    }
  ],
  warningTitle: 'When to stop tweaking the prompt',
  warnings: [
    {
      title: 'You keep patching the same prompt',
      text: 'If every fix is another sentence, the task design is probably the real issue.'
    },
    {
      title: 'The source input is low quality',
      text: 'If the input is messy or incomplete, even a polished prompt will stay unstable.'
    },
    {
      title: 'You actually need a tool chain',
      text: 'Retrieval, memory, structuring, and review are often workflow problems, not prompt-only problems.'
    }
  ],
  articleTitle: 'Selected posts on prompting and workflows',
  articleDescription: 'Start here if you want better judgment on how to write prompts, attach them, and stop overusing them.',
  articleCta: { href: '/archive', label: 'Browse all posts' },
  nextTitle: 'Where to go next',
  nextCards: [
    {
      title: 'Need tool coordination',
      text: 'Go to /tools to see how prompts work with a wider operating stack.',
      href: '/tools',
      label: 'Open tools'
    },
    {
      title: 'Need implementation cases',
      text: 'Go to /cases to see how prompts are embedded inside real tasks and flows.',
      href: '/cases',
      label: 'Open cases'
    },
    {
      title: 'Need deeper model intuition',
      text: 'Go to /basicai to understand model behavior and why prompts fail in the first place.',
      href: '/basicai',
      label: 'Open basicai'
    }
  ]
}

const PromptPage = ({ promptPosts }) => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='pb-20 pt-8 sm:pt-10'>
      <section className='px-5'>
        <div className='mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
          <div className='relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.20),_transparent_24%),radial-gradient(circle_at_82%_18%,_rgba(236,72,153,0.14),_transparent_22%),linear-gradient(135deg,_#fffaf5,_#fff1f2_48%,_#f8fafc)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
            <div className='absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-amber-200/40 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-rose-200/40 blur-3xl' />

            <div className='relative grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center'>
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
                    {content.frameLabel}
                  </div>
                  <div className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                    {content.frameValue}
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600'>
                    {content.frameText}
                  </p>
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-2'>
                  {content.principles.map(item => (
                    <div
                      key={item.title}
                      className='rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-lg font-bold text-slate-950'>
                        {item.title}
                      </div>
                      <p className='mt-3 text-sm leading-7 text-slate-600'>
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
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr]'>
          <div className='rounded-[30px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-amber-300'>
              {content.scenariosTitle}
            </div>
            <div className='mt-6 space-y-4'>
              {content.scenarios.map(item => (
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
                alt='Prompt workflow board'
                className='h-72 w-full object-cover object-center md:h-full'
              />
              <div className='bg-[linear-gradient(135deg,_#fffaf5,_#fff1f2)] p-7 sm:p-8'>
                <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  {content.warningTitle}
                </div>
                <div className='mt-6 space-y-4'>
                  {content.warnings.map(item => (
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
            {promptPosts.map(post => (
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
                <div className='mt-4 text-xl font-bold text-slate-950 transition group-hover:text-amber-700'>
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
  const props = await getGlobalData({ from: 'prompt-page', locale })
  const promptPosts = (props.allPages || [])
    .filter(
      page =>
        page?.type === 'Post' &&
        page?.status === 'Published' &&
        Array.isArray(page?.tags) &&
        ['AI Tools', 'Workflow', 'SEO', 'LLM'].some(tag =>
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
    title: locale === 'en-US' ? 'AI Prompting | CharliiAI' : 'AI提示词 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Practical prompt design guidance for real tasks, workflows, and AI tool usage.'
        : '围绕真实任务、工作流和工具使用整理 AI 提示词设计方法。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/prompt`
  }

  return buildStaticPropsResult({ ...props, promptPosts }, ISR_LIST_REVALIDATE)
}

export default PromptPage

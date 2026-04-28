import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'

const capabilityCards = [
  {
    title: 'AI workflows',
    description:
      '把工具评测、内容生产、自动化执行和增长动作串成真正能落地的工作流。'
  },
  {
    title: 'Research to action',
    description:
      '不只讲模型和概念，更关心一套方法怎么进入真实业务、创作和运营场景。'
  },
  {
    title: 'Operator mindset',
    description:
      '偏实战、偏效率、偏结果导向，少空话，多给清晰判断和可复用方案。'
  }
]

const focusAreas = [
  'AI 工具评测与选型判断',
  '自动化工作流与内容生产提效',
  'AIGC、Agent、LLM 实战案例',
  '出海增长、SEO 与独立站运营'
]

const workPrinciples = [
  {
    title: '先判断是否值得做',
    text:
      '很多 AI 产品看起来很热闹，但未必值得团队投入。CharliiAI 更关注工具是否稳定、是否可复用、是否真的节省时间。'
  },
  {
    title: '把复杂内容翻译成可执行步骤',
    text:
      '文章会尽量把模型、接口、工作流和商业场景拆开讲清楚，让读者可以直接照着验证，而不是停留在概念层。'
  },
  {
    title: '保留审美，不做流水线信息站',
    text:
      '内容站不应该只是关键词堆叠。CharliiAI 也会重视结构、阅读体验、品牌感和页面叙事。'
  }
]

const founderTimeline = [
  {
    phase: '01',
    title: 'Research and synthesis',
    text:
      '先从 AI 工具、模型、接口和工作流里做筛选，把信息噪音压缩成可读、可判断的结构。'
  },
  {
    phase: '02',
    title: 'Operator-style validation',
    text:
      '再从 SEO、内容生产、自动化和站点经营的角度验证，判断这套东西能不能真正进入生产环境。'
  },
  {
    phase: '03',
    title: 'Ship as usable content',
    text:
      '最后把结果写成可以直接转用的页面、清单、模板和方法，而不是只给概念或新闻摘要。'
  }
]

const founderSignals = [
  '长期关注 AI 工具、SEO、内容增长和独立站系统',
  '输出偏“实战判断”，不是单纯的信息搬运',
  '重视品牌感、页面体验和可执行性并存',
  '适合需要 AI + 内容 + 增长交叉视角的人'
]

const founderManifesto = [
  '工具只有进入真实流程，才算真正有价值。',
  '内容不是为了填关键词，而是为了建立判断力。',
  '增长不该和审美对立，品牌感本身也是效率的一部分。',
  'AI 最有价值的地方，不是替代人，而是放大人的产出密度。'
]

const featuredTopics = [
  {
    title: 'AI tooling',
    text: '模型、Agent、工作流产品、效率工具和实战型选型判断。'
  },
  {
    title: 'Content systems',
    text: '从选题、写作、分发到搜索流量，把内容做成稳定运转的系统。'
  },
  {
    title: 'Growth and SEO',
    text: '独立站、搜索意图、页面结构和长期增长，而不是只看短期爆发。'
  }
]

const featuredEssays = [
  {
    href: '/article/agent',
    title: 'AI Agent 方向内容',
    description: '如果你关心 Agent、工作流和自动化系统，这是最核心的一条线。'
  },
  {
    href: '/tools',
    title: 'Tools 导航',
    description: '集中看当前站内覆盖的 AI 工具、产品入口和相关资源。'
  },
  {
    href: '/archive',
    title: 'All essays',
    description: '从文章归档里看完整输出，更能看清 CharliiAI 的判断框架。'
  }
]

const AboutPage = () => {
  return (
    <main className='pb-20'>
      <section className='px-5 pt-8 sm:pt-10'>
        <div className='mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
          <div className='relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_24%),radial-gradient(circle_at_85%_20%,_rgba(251,191,36,0.16),_transparent_20%),linear-gradient(135deg,_#f8fbff,_#eef5ff_45%,_#f9fafb)] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
            <div className='absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-cyan-200/40 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-amber-200/40 blur-3xl' />

            <div className='relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
              <div>
                <div className='mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur'>
                  About CharliiAI
                </div>
                <h1 className='max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl'>
                  一个把 AI 工具、自动化和内容增长讲明白的网站。
                </h1>
                <p className='mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
                  CharliiAI
                  关注的不只是“这个模型厉不厉害”，而是它能不能真正进入创作、研究、运营和增长场景，帮你省时间、提质量、拿结果。
                </p>

                <div className='mt-8 flex flex-wrap gap-3'>
                  <a
                    href='/contact'
                    className='inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'>
                    联系合作
                  </a>
                  <a
                    href='/tools'
                    className='inline-flex items-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950'>
                    查看工具导航
                  </a>
                </div>

                <div className='mt-10 grid gap-4 sm:grid-cols-3'>
                  {capabilityCards.map(card => (
                    <div
                      key={card.title}
                      className='rounded-3xl border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700'>
                        {card.title}
                      </div>
                      <p className='mt-3 text-sm leading-7 text-slate-600'>
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='relative mx-auto w-full max-w-md'>
                <div className='overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 p-3 shadow-[0_25px_80px_rgba(15,23,42,0.18)]'>
                  <div className='relative overflow-hidden rounded-[24px] bg-slate-900'>
                    <img
                      src='/avatar.png'
                      alt='Dr. Charlii'
                      className='h-[420px] w-full object-cover object-center'
                    />
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-6 text-white'>
                      <div className='text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300'>
                        Dr. Charlii
                      </div>
                      <div className='mt-2 text-2xl font-bold'>
                        Builder, researcher, operator
                      </div>
                      <p className='mt-3 text-sm leading-7 text-slate-200'>
                        以内容、SEO、自动化和 AI
                        工具系统为主线，持续做高密度、可执行、可验证的实践型输出。
                      </p>
                    </div>
                  </div>
                </div>

                <div className='absolute -bottom-6 -left-5 hidden w-56 rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.10)] md:block'>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Focus
                  </div>
                  <div className='mt-3 text-2xl font-black text-slate-950'>
                    AI x Content x Growth
                  </div>
                  <p className='mt-2 text-sm leading-6 text-slate-600'>
                    不是为了追热点，而是为了把 AI 真正接进生产流程。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
          <div className='rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              What this site covers
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
              CharliiAI 主要在写什么
            </h2>
            <p className='mt-4 text-base leading-8 text-slate-600'>
              这里不是传统资讯站，也不是单纯的教程仓库。内容更偏向“研究后的判断”和“实践后的总结”。
            </p>
            <div className='mt-6 space-y-3'>
              {focusAreas.map(item => (
                <div
                  key={item}
                  className='rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700'>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Working style
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
              我会怎么写、怎么判断
            </h2>
            <div className='mt-6 space-y-5'>
              {workPrinciples.map(item => (
                <div
                  key={item.title}
                  className='rounded-[24px] border border-slate-200 p-5'>
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
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
          <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <div className='grid gap-0 md:grid-cols-[0.95fr_1.05fr]'>
              <div className='p-7 sm:p-8'>
                <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  Founder profile
                </div>
                <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                  更像研究者，也更像操盘手
                </h2>
                <p className='mt-4 text-base leading-8 text-slate-600'>
                  Dr. Charlii
                  这条线，不是传统媒体编辑路径，也不是单纯技术博客路径，而是站在“内容、流量、工具、自动化”交叉口去看问题。
                </p>
                <p className='mt-4 text-base leading-8 text-slate-600'>
                  所以这里的文章往往会同时回答几个问题：这个东西是什么、值不值得用、适合谁、怎么接进真实业务、以及它能不能帮你放大产出。
                </p>

                <div className='mt-6 grid gap-3'>
                  {founderSignals.map(item => (
                    <div
                      key={item}
                      className='rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700'>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className='relative min-h-[320px] bg-slate-100'>
                <img
                  src='/images/testimonial.jpg'
                  alt='Founder atmosphere'
                  className='h-full w-full object-cover object-center'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                  <div className='text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300'>
                    Perspective
                  </div>
                  <div className='mt-2 text-2xl font-bold'>
                    AI should compound output, not create noise.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Timeline
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
              CharliiAI 的内容是怎么长出来的
            </h2>
            <div className='mt-8 space-y-6'>
              {founderTimeline.map(item => (
                <div
                  key={item.phase}
                  className='grid gap-4 rounded-[26px] border border-slate-200 p-5 sm:grid-cols-[72px_1fr]'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white'>
                    {item.phase}
                  </div>
                  <div>
                    <div className='text-lg font-bold text-slate-950'>
                      {item.title}
                    </div>
                    <p className='mt-2 text-sm leading-7 text-slate-600'>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className='rounded-[30px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_16px_40px_rgba(15,23,42,0.10)] sm:p-8'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300'>
              Manifesto
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight'>
              CharliiAI 更接近一种内容方法，而不只是一个站。
            </h2>
            <div className='mt-8 grid gap-3'>
              {founderManifesto.map(item => (
                <div
                  key={item}
                  className='rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200'>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <div className='grid gap-0 sm:grid-cols-2'>
              <img
                src='/images/hero-image.png'
                alt='Workspace visual'
                className='h-64 w-full object-cover object-center sm:h-full'
              />
              <div className='bg-[linear-gradient(135deg,_#f8fafc,_#eef5ff)] p-7 sm:p-8'>
                <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  Featured topics
                </div>
                <div className='mt-6 space-y-4'>
                  {featuredTopics.map(item => (
                    <div
                      key={item.title}
                      className='rounded-[22px] border border-slate-200 bg-white/80 p-4'>
                      <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700'>
                        {item.title}
                      </div>
                      <div className='mt-2 text-sm leading-7 text-slate-600'>
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]'>
            <img
              src='/images/home.png'
              alt='CharliiAI workspace'
              className='h-64 w-full object-cover object-center sm:h-80'
            />
            <div className='p-7'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                Editorial note
              </div>
              <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                这个网站如何保持更新
              </h2>
              <p className='mt-4 text-base leading-8 text-slate-600'>
                内容会来自真实试用、官方文档、工作流实验、SEO
                观察和产品研究。涉及价格、政策、模型能力或接口变动的页面，会随着信息变化持续修订。
              </p>
              <p className='mt-4 text-base leading-8 text-slate-600'>
                如果文章中出现外部链接、广告、合作或联盟关系，也会尽量明确区分，让读者知道哪些内容是纯编辑判断，哪些是商业合作场景。
              </p>

              <div className='mt-7 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Output style
                  </div>
                  <div className='mt-2 text-sm leading-7 text-slate-700'>
                    长文、工具拆解、工作流方案、搜索型选题和判断型内容并行。
                  </div>
                </div>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Audience
                  </div>
                  <div className='mt-2 text-sm leading-7 text-slate-700'>
                    更适合独立开发者、操盘手、内容团队、研究型创作者和想做 AI 增长的人。
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[30px] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300'>
              Contact
            </div>
            <h2 className='mt-3 text-3xl font-black tracking-tight'>
              想聊合作、咨询或内容需求？
            </h2>
            <p className='mt-4 text-base leading-8 text-slate-300'>
              对外联系以邮箱为主，这对海外读者和品牌团队也更直接。适合聊的内容包括 AI
              工作流、内容增长、SEO、出海站点、自动化系统和合作项目。
            </p>

            <div className='mt-8 space-y-4 rounded-[24px] border border-white/10 bg-white/5 p-5'>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  Primary email
                </div>
                <a
                  href='mailto:charliiai2024@gmail.com'
                  className='mt-2 inline-block text-lg font-semibold text-white hover:text-cyan-300'>
                  charliiai2024@gmail.com
                </a>
                <p className='mt-2 text-sm leading-6 text-slate-400'>
                  Best for partnerships, media, consulting, and international inquiries.
                </p>
              </div>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  Social
                </div>
                <a
                  href='https://x.com/charliiai'
                  target='_blank'
                  rel='noreferrer'
                  className='mt-2 inline-block text-lg font-semibold text-white hover:text-cyan-300'>
                  x.com/charliiai
                </a>
                <p className='mt-2 text-sm leading-6 text-slate-400'>
                  Prefer email first. X works well for public updates and lightweight outreach.
                </p>
              </div>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  WeChat
                </div>
                <div className='mt-2 text-lg font-semibold text-white'>
                  Charliiai2024
                </div>
                <p className='mt-2 text-sm leading-6 text-slate-400'>
                  Useful for Chinese-speaking contacts, but not the primary channel for global visitors.
                </p>
              </div>
              <div>
                <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  Links
                </div>
                <div className='mt-2 flex flex-wrap gap-3'>
                  <a
                    href='/contact'
                    className='rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'>
                    Open contact page
                  </a>
                  <a
                    href='/privacy-policy'
                    className='rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30'>
                    Privacy policy
                  </a>
                  <a
                    href='/terms-of-service'
                    className='rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30'>
                    Terms of service
                  </a>
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
                Selected entry points
              </div>
              <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950'>
                如果你第一次来到这里，建议从这些入口开始
              </h2>
            </div>
            <a
              href='/archive'
              className='inline-flex items-center rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950'>
              Browse all posts
            </a>
          </div>

          <div className='mt-8 grid gap-4 lg:grid-cols-3'>
            {featuredEssays.map(item => (
              <a
                key={item.href}
                href={item.href}
                className='group rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white'>
                <div className='text-xl font-bold text-slate-950 transition group-hover:text-cyan-700'>
                  {item.title}
                </div>
                <p className='mt-3 text-sm leading-7 text-slate-600'>
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'about-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'About | CharliiAI',
    description:
      'About CharliiAI, its content focus, editorial perspective, and contact information.',
    pageCover: '/images/home.png',
    link: 'https://www.charliiai.com/about'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default AboutPage

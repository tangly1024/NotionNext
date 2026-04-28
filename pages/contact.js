import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const ContactPage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'

  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(135deg,_#f8fbff,_#eef5ff_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
          <div className='max-w-3xl'>
            <div className='inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600'>
              {isEnglish ? 'Contact' : '联系'}
            </div>
            <h1 className='mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
              {isEnglish ? 'Contact CharliiAI' : '联系 CharliiAI'}
            </h1>
            <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
              {isEnglish
                ? 'Email is the primary contact method. It works better for international outreach, partnerships, consulting requests, and media inquiries.'
                : '邮箱是主联系方式，更适合合作咨询、媒体沟通、海外交流和需要详细背景说明的来信。'}
            </p>
          </div>

          <div className='mt-8 grid gap-5 lg:grid-cols-3'>
            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {isEnglish ? 'Primary email' : '主邮箱'}
              </div>
              <a
                href='mailto:charliiai2024@gmail.com'
                className='mt-3 inline-block text-2xl font-bold text-slate-950 hover:text-cyan-700'>
                charliiai2024@gmail.com
              </a>
              <p className='mt-3 text-sm leading-7 text-slate-600'>
                {isEnglish
                  ? 'Best for business requests, consulting, collaboration, sponsorships, and detailed questions.'
                  : '适合商务合作、顾问咨询、品牌合作、赞助沟通和需要详细说明的问题。'}
              </p>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                X
              </div>
              <a
                href='https://x.com/charliiai'
                target='_blank'
                rel='noreferrer'
                className='mt-3 inline-block text-2xl font-bold text-slate-950 hover:text-cyan-700'>
                @charliiai
              </a>
              <p className='mt-3 text-sm leading-7 text-slate-600'>
                {isEnglish
                  ? 'Good for public updates, lightweight outreach, and keeping up with new posts.'
                  : '适合公开动态、轻量联系以及跟进新的内容更新。'}
              </p>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                WeChat
              </div>
              <div className='mt-3 text-2xl font-bold text-slate-950'>
                Charliiai2024
              </div>
              <p className='mt-3 text-sm leading-7 text-slate-600'>
                {isEnglish
                  ? 'Mainly for Chinese-speaking contacts. For global communication, email is recommended first.'
                  : '更适合中文环境沟通；如果是国际联系，建议优先使用邮箱。'}
              </p>
            </div>
          </div>

          <div className='mt-8 rounded-[28px] border border-slate-200 bg-white p-6'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              {isEnglish ? 'What to include' : '建议附带的信息'}
            </div>
            <p className='mt-3 text-sm leading-7 text-slate-600'>
              {isEnglish
                ? 'To get a faster reply, include the page URL, your request, and relevant background such as company, brand, market, partnership idea, or project scope.'
                : '为了更快收到回复，建议附上页面链接、具体诉求，以及公司、品牌、市场、合作想法或项目范围等背景信息。'}
            </p>
            <p className='mt-3 text-sm leading-7 text-slate-600'>
              {isEnglish
                ? 'Messages are reviewed manually, so response time can vary depending on workload and the nature of the request.'
                : '所有来信都会人工查看，因此回复时间会根据工作量和问题类型有所不同。'}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'contact-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'Contact | CharliiAI' : '联系 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Contact CharliiAI for partnerships, questions, feedback, and site support.'
        : '联系 CharliiAI，获取合作咨询、反馈沟通与站点相关支持。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/contact`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default ContactPage

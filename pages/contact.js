import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'

const ContactPage = () => {
  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(135deg,_#f8fbff,_#eef5ff_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
          <div className='max-w-3xl'>
            <div className='inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600'>
              Contact
            </div>
            <h1 className='mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
              Contact CharliiAI
            </h1>
            <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
              Email is the primary contact method. It works better for international outreach, partnerships, consulting requests, and media inquiries.
            </p>
          </div>

          <div className='mt-8 grid gap-5 lg:grid-cols-3'>
            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                Primary email
              </div>
              <a
                href='mailto:charliiai2024@gmail.com'
                className='mt-3 inline-block text-2xl font-bold text-slate-950 hover:text-cyan-700'>
                charliiai2024@gmail.com
              </a>
              <p className='mt-3 text-sm leading-7 text-slate-600'>
                Best for business requests, consulting, collaboration, sponsorships, and detailed questions.
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
                Good for public updates, lightweight outreach, and keeping up with new posts.
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
                Mainly for Chinese-speaking contacts. For global communication, email is recommended first.
              </p>
            </div>
          </div>

          <div className='mt-8 rounded-[28px] border border-slate-200 bg-white p-6'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              What to include
            </div>
            <p className='mt-3 text-sm leading-7 text-slate-600'>
              To get a faster reply, include the page URL, your request, and relevant background such as company, brand, market, partnership idea, or project scope.
            </p>
            <p className='mt-3 text-sm leading-7 text-slate-600'>
              Messages are reviewed manually, so response time can vary depending on workload and the nature of the request.
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
    title: 'Contact | CharliiAI',
    description:
      'Contact CharliiAI for partnerships, questions, feedback, and site support.',
    pageCover: '/images/home.png',
    link: 'https://www.charliiai.com/contact'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default ContactPage

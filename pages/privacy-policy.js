import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Privacy',
  title: '隐私政策',
  updatedAt: '最后更新于 2026 年 4 月 28 日。',
  intro:
    'CharliiAI 尊重访问者隐私。本页说明我们可能收集哪些信息、这些信息如何被使用，以及你可以通过什么方式联系我们。',
  sections: [
    {
      heading: '我们可能收集的信息',
      text: '当你浏览本站时，我们可能会收集基础访问数据，例如页面访问、设备类型、浏览器信息、来源页面和站内交互数据。如果你主动通过邮箱或其他方式联系，也会保存你主动提供的联系方式与沟通内容。'
    },
    {
      heading: '信息用途',
      text: '这些信息主要用于内容优化、网站安全、访问分析、广告效果评估，以及回应你的咨询、合作或支持请求。'
    },
    {
      heading: 'Cookies 与第三方服务',
      text: '本站可能使用 Cookies 以及第三方统计、广告或性能服务，例如分析工具与广告平台，用于了解访问情况并改进体验。具体第三方服务可能随站点运营需要调整。'
    },
    {
      heading: '信息共享',
      text: '除法律要求、站点安全需要、基础服务履行或你主动授权外，我们不会主动出售你的个人信息。'
    },
    {
      heading: '你的选择',
      text: '你可以通过浏览器设置限制 Cookies，也可以选择不主动提交联系方式或敏感信息。继续使用本站通常意味着你接受本隐私政策中描述的做法。'
    }
  ],
  contactTitle: '隐私相关联系',
  contactText: '如对隐私政策、数据使用或联系信息处理有疑问，请直接发邮件。',
  email: 'charliiai2024@gmail.com'
}

const enContent = {
  eyebrow: 'Privacy',
  title: 'Privacy Policy',
  updatedAt: 'Last updated on April 28, 2026.',
  intro:
    'CharliiAI respects visitor privacy. This page explains what information may be collected, how it may be used, and how to contact us about privacy-related questions.',
  sections: [
    {
      heading: 'Information we may collect',
      text: 'When you browse the site, we may collect basic visit data such as page views, device type, browser information, referrers, and on-site interaction signals. If you contact us by email or other channels, we may also retain the contact details and message content you provide voluntarily.'
    },
    {
      heading: 'How the information is used',
      text: 'This information may be used for content improvement, site security, traffic analysis, advertising evaluation, and responding to support, partnership, or other inbound requests.'
    },
    {
      heading: 'Cookies and third-party services',
      text: 'The site may use cookies and third-party analytics, advertising, or performance services to understand traffic and improve the user experience. The exact service mix may change as the site evolves.'
    },
    {
      heading: 'Information sharing',
      text: 'We do not intentionally sell personal information, except where disclosure is required by law, necessary for site security, needed for core service operations, or explicitly authorized by you.'
    },
    {
      heading: 'Your choices',
      text: 'You can limit cookies in your browser and choose not to submit contact details or sensitive information. Continued use of the site generally means you accept the practices described in this policy.'
    }
  ],
  contactTitle: 'Privacy contact',
  contactText: 'For questions about privacy, data use, or contact handling, email the primary address directly.',
  email: 'charliiai2024@gmail.com'
}

const PrivacyPolicyPage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(135deg,_#f6fffb,_#eefcf6_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
          <div className='max-w-3xl'>
            <div className='inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600'>
              {content.eyebrow}
            </div>
            <h1 className='mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
              {content.title}
            </h1>
            <p className='mt-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-500'>
              {content.updatedAt}
            </p>
            <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>
              {content.intro}
            </p>
          </div>

          <div className='mt-8 grid gap-5'>
            {content.sections.map(section => (
              <div
                key={section.heading}
                className='rounded-[28px] border border-slate-200 bg-white p-6'>
                <h2 className='text-2xl font-black tracking-tight text-slate-950'>
                  {section.heading}
                </h2>
                <p className='mt-3 text-sm leading-7 text-slate-600 sm:text-base'>
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <div className='mt-8 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white'>
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300'>
              {content.contactTitle}
            </div>
            <p className='mt-3 text-sm leading-7 text-slate-300'>
              {content.contactText}
            </p>
            <a
              href={`mailto:${content.email}`}
              className='mt-4 inline-block text-2xl font-bold text-white hover:text-emerald-300'>
              {content.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'privacy-policy-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'Privacy Policy | CharliiAI' : '隐私政策 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Privacy policy for CharliiAI site visits, cookies, analytics, and contact data.'
        : 'CharliiAI 网站访问、Cookies、分析服务与联系信息处理的隐私政策。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/privacy-policy`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default PrivacyPolicyPage

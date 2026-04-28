import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'Terms',
  title: '服务条款',
  updatedAt: '最后更新于 2026 年 4 月 28 日。',
  intro:
    '访问或使用 CharliiAI，即表示你同意遵守这些服务条款。如果你不同意，请停止访问或使用本站内容与相关服务。',
  sections: [
    {
      heading: '内容说明',
      text: '本站主要提供 AI 工具、工作流、研究观察、内容策略与实用指南。所有内容仅供一般信息参考，不构成法律、财务或其他专业建议。'
    },
    {
      heading: '使用限制',
      text: '你不得利用本站从事违法活动、恶意抓取、攻击、传播有害内容，或以任何方式干扰网站、服务、基础设施与正常访问体验。'
    },
    {
      heading: '知识产权',
      text: '除特别声明外，本站原创内容的著作权归 CharliiAI 所有。转载、引用或二次分发请保留来源，并遵守适用法律和合理使用规则。'
    },
    {
      heading: '第三方链接',
      text: '站内可能包含第三方链接、工具或服务。第三方网站的内容、政策、价格、可用性与风险由其自身负责，请自行判断并承担使用风险。'
    },
    {
      heading: '责任限制',
      text: '在适用法律允许的最大范围内，本站不对因使用或无法使用本站内容、链接、工具或服务而造成的直接、间接或附带损失承担责任。'
    }
  ],
  contactTitle: '联系条款相关问题',
  contactText: '如对服务条款有任何问题，请优先发送邮件至主邮箱。',
  email: 'charliiai2024@gmail.com'
}

const enContent = {
  eyebrow: 'Terms',
  title: 'Terms of Service',
  updatedAt: 'Last updated on April 28, 2026.',
  intro:
    'By accessing or using CharliiAI, you agree to these terms. If you do not agree, you should stop using the site and related services.',
  sections: [
    {
      heading: 'Content scope',
      text: 'This site mainly publishes AI tools, workflow notes, research observations, content strategy, and practical guidance. Nothing on the site should be treated as legal, financial, or other professional advice.'
    },
    {
      heading: 'Use restrictions',
      text: 'You may not use the site for unlawful activity, abusive scraping, attacks, harmful distribution, or any behavior that disrupts the site, services, infrastructure, or normal access.'
    },
    {
      heading: 'Intellectual property',
      text: 'Unless otherwise stated, original content on this site belongs to CharliiAI. Reuse, quotation, or redistribution should keep attribution and follow applicable law and fair use rules.'
    },
    {
      heading: 'Third-party links',
      text: 'The site may include third-party links, tools, or services. Their content, policies, pricing, availability, and risks are controlled by those third parties, not by this site.'
    },
    {
      heading: 'Limitation of liability',
      text: 'To the maximum extent permitted by law, the site is not liable for direct, indirect, incidental, or consequential loss arising from use of, or inability to use, the site, linked tools, or related services.'
    }
  ],
  contactTitle: 'Questions about these terms',
  contactText: 'For terms-related questions, email the primary contact address.',
  email: 'charliiai2024@gmail.com'
}

const TermsPage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(135deg,_#f8fbff,_#eef5ff_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
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
            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-sky-300'>
              {content.contactTitle}
            </div>
            <p className='mt-3 text-sm leading-7 text-slate-300'>
              {content.contactText}
            </p>
            <a
              href={`mailto:${content.email}`}
              className='mt-4 inline-block text-2xl font-bold text-white hover:text-sky-300'>
              {content.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'terms-of-service-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'Terms of Service | CharliiAI' : '服务条款 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Terms of service for CharliiAI site content, links, and related usage.'
        : 'CharliiAI 网站内容、链接与相关使用说明的服务条款。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/terms-of-service`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default TermsPage

import SmartLink from '@/components/SmartLink'
import { getPostEnhancement } from '@/lib/seo/postEnhancements'

export default function PostIntentPanel({ post }) {
  const enhancement = getPostEnhancement(post)

  if (!enhancement) {
    return null
  }

  return (
    <section className='mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-700 dark:bg-[#1f2128]'>
      <div className='mb-3 text-lg font-semibold text-slate-900 dark:text-white'>
        {enhancement.intentTitle}
      </div>
      <p className='mb-4 text-sm leading-7 text-slate-700 dark:text-slate-300'>
        {enhancement.intentText}
      </p>

      {enhancement.relatedLinks?.length > 0 && (
        <div className='grid gap-3 md:grid-cols-2'>
          {enhancement.relatedLinks.map(link => (
            <SmartLink
              key={link.href}
              href={link.href}
              className='rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 dark:border-gray-700 dark:bg-[#18171d]'>
              <div className='mb-1 text-sm font-semibold text-slate-900 dark:text-white'>
                {link.title}
              </div>
              <div className='text-sm leading-6 text-slate-600 dark:text-slate-400'>
                {link.description}
              </div>
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  )
}

const StaticContentPage = ({ title, updatedAt, sections }) => {
  const introParagraphs = sections?.[0]?.paragraphs || []

  return (
    <main className='pb-20 pt-8 sm:pt-10'>
      <section className='px-5'>
        <div className='mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
          <div className='relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_85%_18%,_rgba(251,191,36,0.14),_transparent_20%),linear-gradient(135deg,_#f8fbff,_#eef5ff_46%,_#f8fafc)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
            <div className='absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-cyan-200/40 blur-3xl' />
            <div className='absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/4 rounded-full bg-amber-200/40 blur-3xl' />

            <div className='relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'>
              <div>
                <div className='inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 backdrop-blur'>
                  CharliiAI Guide
                </div>
                <h1 className='mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl'>
                  {title}
                </h1>
                <div className='mt-5 inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur'>
                  {updatedAt}
                </div>

                <div className='mt-7 space-y-4 text-base leading-8 text-slate-600 sm:text-lg'>
                  {introParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
                {sections
                  .slice(1)
                  .filter(section => section.heading || section.items?.length)
                  .slice(0, 3)
                  .map((section, index) => (
                    <div
                      key={`${section.heading || 'section'}-${index}`}
                      className='rounded-[28px] border border-white/70 bg-white/80 p-5 backdrop-blur'>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700'>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className='mt-3 text-lg font-bold text-slate-950'>
                        {section.heading || 'Highlights'}
                      </div>
                      {section.items?.[0] ? (
                        <p className='mt-2 text-sm leading-7 text-slate-600'>
                          {section.items[0]}
                        </p>
                      ) : section.paragraphs?.[0] ? (
                        <p className='mt-2 text-sm leading-7 text-slate-600'>
                          {section.paragraphs[0]}
                        </p>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-5 pt-8'>
        <div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.88fr_1.12fr]'>
          {sections.map((section, index) => {
            const isIntroSection = index === 0
            const itemCount = section.items?.length || 0

            return (
              <article
                key={index}
                className={`rounded-[30px] border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.05)] ${
                  isIntroSection
                    ? 'bg-slate-950 text-white lg:col-span-2'
                    : 'bg-white'
                }`}>
                <div className='p-7 sm:p-8'>
                  <div
                    className={`text-sm font-semibold uppercase tracking-[0.18em] ${
                      isIntroSection ? 'text-cyan-300' : 'text-slate-500'
                    }`}>
                    {section.heading || 'Overview'}
                  </div>

                  {!isIntroSection && section.paragraphs?.length ? (
                    <div className='mt-5 space-y-4 text-base leading-8 text-slate-600'>
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {isIntroSection && section.paragraphs?.length > 2 ? (
                    <div className='mt-5 space-y-4 text-base leading-8 text-slate-300'>
                      {section.paragraphs.slice(2).map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {itemCount > 0 ? (
                    <div
                      className={`mt-6 grid gap-3 ${
                        itemCount > 3 ? 'sm:grid-cols-2' : ''
                      }`}>
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`rounded-[22px] px-4 py-4 text-sm leading-7 ${
                            isIntroSection
                              ? 'border border-white/10 bg-white/5 text-slate-100'
                              : 'bg-slate-50 text-slate-700'
                          }`}>
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default StaticContentPage

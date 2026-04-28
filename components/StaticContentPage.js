const StaticContentPage = ({ title, updatedAt, sections }) => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>{title}</h1>
        <p>{updatedAt}</p>
        {sections.map((section, index) => (
          <section key={index}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs?.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {section.items?.length ? (
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </main>
  )
}

export default StaticContentPage

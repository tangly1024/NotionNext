const ContactPage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>Contact</h1>
        <p>Last updated: April 17, 2026.</p>
        <p>
          You can reach CharliiAI for general questions, partnership requests,
          media inquiries, or website issues through the channels below.
        </p>

        <h2>Email</h2>
        <p>
          Primary contact:{' '}
          <a href='mailto:mail@charliiai.com'>mail@charliiai.com</a>
        </p>

        <h2>What to include</h2>
        <p>
          To speed up a reply, include the page URL, your request, and any
          relevant context such as brand, company, or partnership details.
        </p>

        <h2>Response expectations</h2>
        <p>
          Messages are reviewed manually. Response times may vary depending on
          workload, travel, and the nature of the request.
        </p>
      </article>
    </main>
  )
}

export function getStaticProps() {
  return {
    props: {
      siteInfo: {
        title: 'Contact | CharliiAI',
        description:
          'Contact CharliiAI for partnerships, questions, feedback, and site support.',
        pageCover: '/bg_image.jpg',
        link: 'https://www.charliiai.com/contact'
      },
      NOTION_CONFIG: {}
    }
  }
}

export default ContactPage

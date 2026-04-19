const AboutPage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>About CharliiAI</h1>
        <p>Last updated: April 17, 2026.</p>
        <p>
          CharliiAI is an independent website focused on AI tools, research
          workflows, AIGC, and practical guides for builders, researchers, and
          creators.
        </p>
        <p>
          The site is built to help readers understand how new AI products work
          in practice, how they compare to alternatives, and how they can be
          applied in real workflows without hype or unnecessary complexity.
        </p>

        <h2>Mission</h2>
        <p>
          CharliiAI publishes practical, readable content that turns fast-moving
          AI updates into usable knowledge. The focus is not only on what a
          tool claims to do, but on whether it is useful, repeatable, and worth
          adopting.
        </p>

        <h2>What this site publishes</h2>
        <p>
          The site covers AI product analysis, hands-on tool tutorials,
          research-oriented workflows, and selected industry observations. The
          goal is to make new AI tools and methods easier to evaluate and use.
        </p>
        <ul>
          <li>AI tool reviews and comparisons</li>
          <li>Workflow guides for research, writing, automation, and content</li>
          <li>Notes on AI commercialization, growth, and product strategy</li>
          <li>Selected commentary on AIGC and applied AI trends</li>
        </ul>

        <h2>Who runs it</h2>
        <p>
          The site is operated under the CharliiAI brand by Dr. Charlii. Some
          pages may include external links, product references, or advertising
          integrations that help support ongoing publishing.
        </p>
        <p>
          CharliiAI is an editorial website rather than a community forum or
          user-generated content platform. Articles are written, curated, or
          updated by the site operator.
        </p>

        <h2>How content is prepared</h2>
        <p>
          Content may be based on direct product testing, public documentation,
          industry research, experiment notes, or hands-on workflow use cases.
          Articles can be updated when tools, pricing, interfaces, or policies
          change.
        </p>
        <p>
          When an article includes fast-changing product details, readers should
          verify important claims on the official product site before making a
          purchase or business decision.
        </p>

        <h2>Editorial note</h2>
        <p>
          Content is created for informational and educational purposes. When a
          page contains sponsored content, affiliate links, or advertising, it
          should be treated as commercial content in addition to editorial
          commentary.
        </p>
        <p>
          CharliiAI aims to distinguish clearly between editorial content,
          sponsored mentions, affiliate relationships, and advertising whenever
          relevant.
        </p>

        <h2>Privacy and terms</h2>
        <p>
          Site use is also governed by the{' '}
          <a href='/privacy-policy'>Privacy Policy</a> and{' '}
          <a href='/terms-of-service'>Terms of Service</a>. Those pages explain
          how site data is handled and the general conditions of access and use.
        </p>

        <h2>Contact</h2>
        <p>
          For business inquiries, partnerships, or feedback, visit the contact
          page or email{' '}
          <a href='mailto:mail@charliiai.com'>mail@charliiai.com</a>.
        </p>
        <p>
          For direct contact details and expected response scope, see the{' '}
          <a href='/contact'>Contact page</a>.
        </p>
      </article>
    </main>
  )
}

export function getStaticProps() {
  return {
    props: {
      siteInfo: {
        title: 'About | CharliiAI',
        description:
          'About CharliiAI, its content focus, editorial scope, and operator information.',
        pageCover: '/bg_image.jpg',
        link: 'https://www.charliiai.com/about'
      },
      NOTION_CONFIG: {}
    }
  }
}

export default AboutPage

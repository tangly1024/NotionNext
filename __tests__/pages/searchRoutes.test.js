describe('search routes rendering strategy', () => {
  test('keyword search route uses SSR instead of ISR fallback generation', () => {
    const route = require('@/pages/search/[keyword]/index')

    expect(typeof route.getServerSideProps).toBe('function')
    expect(route.getStaticPaths).toBeUndefined()
  })

  test('paginated keyword search route uses SSR instead of ISR fallback generation', () => {
    const route = require('@/pages/search/[keyword]/page/[page]')

    expect(typeof route.getServerSideProps).toBe('function')
    expect(route.getStaticPaths).toBeUndefined()
  })
})

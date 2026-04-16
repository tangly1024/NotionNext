export const ISR_DEFAULT_REVALIDATE = 60 * 60 * 4
export const ISR_HOME_REVALIDATE = 60 * 60 * 24
export const ISR_LIST_REVALIDATE = 60 * 60 * 24
export const ISR_CONTENT_REVALIDATE = 60 * 60 * 24 * 7
export const ISR_SEARCH_REVALIDATE = 60 * 60 * 24 * 7

export function buildStaticPropsResult(props, revalidate) {
  if (process.env.EXPORT || typeof revalidate !== 'number') {
    return { props }
  }

  return {
    props,
    revalidate
  }
}

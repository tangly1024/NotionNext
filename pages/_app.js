import \'@/styles/globals.css\'
import \'@/styles/utility-patterns.css\'
import \'@/styles/notion.css\'
import \'react-notion-x/src/styles.css\'
import useAdjustStyle from \'@/hooks/useAdjustStyle\'
import { GlobalContextProvider } from \'@/lib/global\'
import { getBaseLayoutByTheme } from \'@/themes/theme\'
import { useRouter } from \'next/router\'
import { useCallback, useMemo, useEffect } from \'react\'
import { getQueryParam } from \'../lib/utils\'
import BLOG from \'@/blog.config\'
import ExternalPlugins from \'@/components/ExternalPlugins\'
import SEO from \'@/components/SEO\'
import { zhCN } from \'@clerk/localizations\'
import dynamic from \'next/dynamic\'

const ClerkProvider = dynamic(() =>
  import(\'@clerk/nextjs\').then(m => m.ClerkProvider)
)

const MyApp = ({ Component, pageProps }) => {
  useAdjustStyle()
  const router = useRouter()

  useEffect(() => {
    const links = document.querySelectorAll(\'a[href]\');
    const whitelist = BLOG.LINK_WHITELIST || [];

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isExternal = /^https?:\/\//i.test(href) && !href.includes(location.hostname);
      if (isExternal) {
        // Check if the link is in the whitelist
        const inWhitelist = whitelist.some(domain => href.includes(domain));
        if (inWhitelist) return;
        
        if (link.dataset.interceptionAdded) return;
        link.dataset.interceptionAdded = \"true\";

        link.addEventListener('click', e => {
          e.preventDefault();
          sessionStorage.setItem('externalTarget', href);
          router.push('/go');
        });
      }
    });
  }, [router.asPath]);

  const theme = useMemo(() => {
    return (
      getQueryParam(router.asPath, \'theme\') ||
      pageProps?.NOTION_CONFIG?.THEME ||
      BLOG.THEME
    )
  }, [router.asPath])

  const GLayout = useCallback(
    props => {
      const Layout = getBaseLayoutByTheme(theme)
      return <Layout {...props} />
    },
    [theme]
  )

  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const content = (
    <GlobalContextProvider {...pageProps}>
      <GLayout {...pageProps}>
        <SEO {...pageProps} />
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  )

  return (
    <>
      {enableClerk ? (
        <ClerkProvider localization={zhCN}>{content}</ClerkProvider>
      ) : (
        content
      )}
    </>
  )
}

export default MyApp

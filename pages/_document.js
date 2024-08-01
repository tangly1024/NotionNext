// Example for using Google Analytics in a Next.js project
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag'; // Assume you have set up gtag

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url, process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default MyApp;

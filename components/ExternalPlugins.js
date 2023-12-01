import { siteConfig } from '@/lib/config'
import { isSearchEngineBot } from '@/lib/utils'
import dynamic from 'next/dynamic'
import WebWhiz from './Webwhiz'

const TwikooCommentCounter = dynamic(() => import('@/components/TwikooCommentCounter'), { ssr: false })
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), { ssr: false })
const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'), { ssr: false })
const Fireworks = dynamic(() => import('@/components/Fireworks'), { ssr: false })
const Nest = dynamic(() => import('@/components/Nest'), { ssr: false })
const FlutteringRibbon = dynamic(() => import('@/components/FlutteringRibbon'), { ssr: false })
const Ribbon = dynamic(() => import('@/components/Ribbon'), { ssr: false })
const Sakura = dynamic(() => import('@/components/Sakura'), { ssr: false })
const StarrySky = dynamic(() => import('@/components/StarrySky'), { ssr: false })
const Analytics = dynamic(() => import('@vercel/analytics/react').then(async (m) => { return m.Analytics }), { ssr: false })
const MusicPlayer = dynamic(() => import('@/components/Player'), { ssr: false })
const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), { ssr: false })
const Messenger = dynamic(() => import('@/components/FacebookMessenger'), { ssr: false })
const VConsole = dynamic(() => import('@/components/VConsole'), { ssr: false })
const CustomContextMenu = dynamic(() => import('@/components/CustomContextMenu'), { ssr: false })
const DisableCopy = dynamic(() => import('@/components/DisableCopy'), { ssr: false })
const AdBlockDetect = dynamic(() => import('@/components/AdBlockDetect'), { ssr: false })

/**
 * 各种插件脚本
 * @param {*} props
 * @returns
 */
const ExternalPlugin = (props) => {
  if (isSearchEngineBot()) {
    return null
  }

  return <>
    {JSON.parse(siteConfig('THEME_SWITCH')) && <ThemeSwitch />}
    {JSON.parse(siteConfig('DEBUG')) && <DebugPanel />}
    {siteConfig('ANALYTICS_ACKEE_TRACKER') && <Ackee />}
    {siteConfig('ANALYTICS_GOOGLE_ID') && <Gtag />}
    {siteConfig('ANALYTICS_VERCEL') && <Analytics />}
    {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && <Busuanzi />}
    {siteConfig('ADSENSE_GOOGLE_ID') && <GoogleAdsense />}
    {siteConfig('FACEBOOK_APP_ID') && siteConfig('FACEBOOK_PAGE_ID') && <Messenger />}
    {JSON.parse(siteConfig('FIREWORKS')) && <Fireworks />}
    {JSON.parse(siteConfig('SAKURA')) && <Sakura />}
    {JSON.parse(siteConfig('STARRY_SKY')) && <StarrySky />}
    {JSON.parse(siteConfig('MUSIC_PLAYER')) && <MusicPlayer />}
    {JSON.parse(siteConfig('NEST')) && <Nest />}
    {JSON.parse(siteConfig('FLUTTERINGRIBBON')) && <FlutteringRibbon />}
    {JSON.parse(siteConfig('COMMENT_TWIKOO_COUNT_ENABLE')) && <TwikooCommentCounter {...props} />}
    {JSON.parse(siteConfig('RIBBON')) && <Ribbon />}
    {JSON.parse(siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU')) && <CustomContextMenu {...props} />}
    {!JSON.parse(siteConfig('CAN_COPY')) && <DisableCopy />}
    {JSON.parse(siteConfig('WEB_WHIZ_ENABLED')) && <WebWhiz />}
    {JSON.parse(siteConfig('AD_WWADS_BLOCK_DETECT')) && <AdBlockDetect />}
    <VConsole />

    {siteConfig('CHATBASE_ID') && (<>
      <script id={siteConfig('CHATBASE_ID')} src="https://www.chatbase.co/embed.min.js" defer />
      <script async dangerouslySetInnerHTML={{
        __html: `
         window.chatbaseConfig = {
            chatbotId: "${siteConfig('CHATBASE_ID')}",
        }
    `
      }} />
    </>)}

    {siteConfig('COMMENT_DAO_VOICE_ID') && (<>
      {/* DaoVoice 反馈 */}
      <script async dangerouslySetInnerHTML={{
        __html: `
              (function(i,s,o,g,r,a,m){i["DaoVoiceObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.charset="utf-8";m.parentNode.insertBefore(a,m)})(window,document,"script",('https:' == document.location.protocol ? 'https:' : 'http:') + "//widget.daovoice.io/widget/daf1a94b.js","daovoice")
              `
      }}
      />
      <script async dangerouslySetInnerHTML={{
        __html: `
             daovoice('init', {
                app_id: "${siteConfig('COMMENT_DAO_VOICE_ID')}"
              });
              daovoice('update');
              `
      }}
      />
    </>)}

    {siteConfig('AD_WWADS_ID') && <script type="text/javascript" charSet="UTF-8" src="https://cdn.wwads.cn/js/makemoney.js" async></script>}

    {siteConfig('COMMENT_TWIKOO_ENV_ID') && <script defer src={siteConfig('COMMENT_TWIKOO_CDN_URL')} />}

    {siteConfig('COMMENT_ARTALK_SERVER') && <script defer src={siteConfig('COMMENT_ARTALK_JS')} />}

    {siteConfig('COMMENT_TIDIO_ID') && <script async src={`//code.tidio.co/${siteConfig('COMMENT_TIDIO_ID')}.js`} />}

    {/* gitter聊天室 */}
    {siteConfig('COMMENT_GITTER_ROOM') && (<>
      <script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer />
      <script async dangerouslySetInnerHTML={{
        __html: `
            ((window.gitter = {}).chat = {}).options = {
              room: '${siteConfig('COMMENT_GITTER_ROOM')}'
            };
            `
      }} />
    </>)}

    {/* 百度统计 */}
    {siteConfig('ANALYTICS_BAIDU_ID') && (
      <script async
        dangerouslySetInnerHTML={{
          __html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${siteConfig('ANALYTICS_BAIDU_ID')}";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
          `
        }}
      />
    )}

    {/* 站长统计 */}
    {siteConfig('ANALYTICS_CNZZ_ID') && (
      <script async
        dangerouslySetInnerHTML={{
          __html: `
          document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${siteConfig('ANALYTICS_CNZZ_ID')}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${siteConfig('ANALYTICS_CNZZ_ID')}' type='text/javascript'%3E%3C/script%3E"));
          `
        }}
      />
    )}

    {/* 谷歌统计 */}
    {siteConfig('ANALYTICS_GOOGLE_ID') && (<>
      <script async
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig('ANALYTICS_GOOGLE_ID')}`}
      />
      <script async
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig('ANALYTICS_GOOGLE_ID')}', {
                  page_path: window.location.pathname,
                });
              `
        }}
      />
    </>)}

    {/* Matomo 统计 */}
    {siteConfig('MATOMO_HOST_URL') && siteConfig('MATOMO_SITE_ID') && (
      <script async dangerouslySetInnerHTML={{
        __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//${siteConfig('MATOMO_HOST_URL')}/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${siteConfig('MATOMO_SITE_ID')}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `
      }}/>
    )}

  </>
}

export default ExternalPlugin

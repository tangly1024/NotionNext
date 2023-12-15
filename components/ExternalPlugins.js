import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'
import LA51 from './LA51'
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
const LoadingProgress = dynamic(() => import('@/components/LoadingProgress'), { ssr: false })
const AosAnimation = dynamic(() => import('@/components/AOSAnimation'), { ssr: false })

/**
 * 各种插件脚本
 * @param {*} props
 * @returns
 */
const ExternalPlugin = (props) => {
  const DISABLE_PLUGIN = siteConfig('DISABLE_PLUGIN')
  const THEME_SWITCH = siteConfig('THEME_SWITCH')
  const DEBUG = siteConfig('DEBUG')
  const ANALYTICS_ACKEE_TRACKER = siteConfig('ANALYTICS_ACKEE_TRACKER')
  const ANALYTICS_VERCEL = siteConfig('ANALYTICS_VERCEL')
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID')
  const FACEBOOK_APP_ID = siteConfig('FACEBOOK_APP_ID')
  const FACEBOOK_PAGE_ID = siteConfig('FACEBOOK_PAGE_ID')
  const FIREWORKS = siteConfig('FIREWORKS')
  const SAKURA = siteConfig('SAKURA')
  const STARRY_SKY = siteConfig('STARRY_SKY')
  const MUSIC_PLAYER = siteConfig('MUSIC_PLAYER')
  const NEST = siteConfig('NEST')
  const FLUTTERINGRIBBON = siteConfig('FLUTTERINGRIBBON')
  const COMMENT_TWIKOO_COUNT_ENABLE = siteConfig('COMMENT_TWIKOO_COUNT_ENABLE')
  const RIBBON = siteConfig('RIBBON')
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU = siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU')
  const CAN_COPY = siteConfig('CAN_COPY')
  const WEB_WHIZ_ENABLED = siteConfig('WEB_WHIZ_ENABLED')
  const AD_WWADS_BLOCK_DETECT = siteConfig('AD_WWADS_BLOCK_DETECT')
  const CHATBASE_ID = siteConfig('CHATBASE_ID')
  const COMMENT_DAO_VOICE_ID = siteConfig('COMMENT_DAO_VOICE_ID')
  const AD_WWADS_ID = siteConfig('AD_WWADS_ID')
  const COMMENT_TWIKOO_ENV_ID = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const COMMENT_TWIKOO_CDN_URL = siteConfig('COMMENT_TWIKOO_CDN_URL')
  const COMMENT_ARTALK_SERVER = siteConfig('COMMENT_ARTALK_SERVER')
  const COMMENT_ARTALK_JS = siteConfig('COMMENT_ARTALK_JS')
  const COMMENT_TIDIO_ID = siteConfig('COMMENT_TIDIO_ID')
  const COMMENT_GITTER_ROOM = siteConfig('COMMENT_GITTER_ROOM')
  const ANALYTICS_BAIDU_ID = siteConfig('ANALYTICS_BAIDU_ID')
  const ANALYTICS_CNZZ_ID = siteConfig('ANALYTICS_CNZZ_ID')
  const ANALYTICS_GOOGLE_ID = siteConfig('ANALYTICS_GOOGLE_ID')
  const MATOMO_HOST_URL = siteConfig('MATOMO_HOST_URL')
  const MATOMO_SITE_ID = siteConfig('MATOMO_SITE_ID')
  const ANALYTICS_51LA_ID = siteConfig('ANALYTICS_51LA_ID')
  const ANALYTICS_51LA_CK = siteConfig('ANALYTICS_51LA_CK')

  if (DISABLE_PLUGIN) {
    return null
  }

  return <>
        {THEME_SWITCH && <ThemeSwitch />}
        {DEBUG && <DebugPanel />}
        {ANALYTICS_ACKEE_TRACKER && <Ackee />}
        {ANALYTICS_GOOGLE_ID && <Gtag />}
        {ANALYTICS_VERCEL && <Analytics />}
        {ANALYTICS_BUSUANZI_ENABLE && <Busuanzi />}
        {ADSENSE_GOOGLE_ID && <GoogleAdsense />}
        {FACEBOOK_APP_ID && FACEBOOK_PAGE_ID && <Messenger />}
        {FIREWORKS && <Fireworks />}
        {SAKURA && <Sakura />}
        {STARRY_SKY && <StarrySky />}
        {MUSIC_PLAYER && <MusicPlayer />}
        {NEST && <Nest />}
        {FLUTTERINGRIBBON && <FlutteringRibbon />}
        {COMMENT_TWIKOO_COUNT_ENABLE && <TwikooCommentCounter {...props} />}
        {RIBBON && <Ribbon />}
        {CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu {...props} />}
        {!CAN_COPY && <DisableCopy />}
        {WEB_WHIZ_ENABLED && <WebWhiz />}
        {AD_WWADS_BLOCK_DETECT && <AdBlockDetect />}
        <VConsole />
        <LoadingProgress />
        <AosAnimation />
        {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && <LA51/>}

        {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && (<>
            <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js" defer/>
            {/* <script async dangerouslySetInnerHTML={{
              __html: `
                    LA.init({id:"${ANALYTICS_51LA_ID}",ck:"${ANALYTICS_51LA_CK}",hashMode:true,autoTrack:true})
                    `
            }} /> */}
        </>)}

        {CHATBASE_ID && (<>
            <script id={CHATBASE_ID} src="https://www.chatbase.co/embed.min.js" defer />
            <script async dangerouslySetInnerHTML={{
              __html: `
                    window.chatbaseConfig = {
                        chatbotId: "${CHATBASE_ID}",
                        }
                    `
            }} />
        </>)}

        {COMMENT_DAO_VOICE_ID && (<>
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
                app_id: "${COMMENT_DAO_VOICE_ID}"
              });
              daovoice('update');
              `
            }}
            />
        </>)}

        {AD_WWADS_ID && <script type="text/javascript" charSet="UTF-8" src="https://cdn.wwads.cn/js/makemoney.js" async></script>}

        {COMMENT_TWIKOO_ENV_ID && <script defer src={COMMENT_TWIKOO_CDN_URL} />}

        {COMMENT_ARTALK_SERVER && <script defer src={COMMENT_ARTALK_JS} />}

        {COMMENT_TIDIO_ID && <script async src={`//code.tidio.co/${COMMENT_TIDIO_ID}.js`} />}

        {/* gitter聊天室 */}
        {COMMENT_GITTER_ROOM && (<>
            <script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer />
            <script async dangerouslySetInnerHTML={{
              __html: `
            ((window.gitter = {}).chat = {}).options = {
              room: '${COMMENT_GITTER_ROOM}'
            };
            `
            }} />
        </>)}

        {/* 百度统计 */}
        {ANALYTICS_BAIDU_ID && (
            <script async
                dangerouslySetInnerHTML={{
                  __html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${ANALYTICS_BAIDU_ID}";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
          `
                }}
            />
        )}

        {/* 站长统计 */}
        {ANALYTICS_CNZZ_ID && (
            <script async
                dangerouslySetInnerHTML={{
                  __html: `
          document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${ANALYTICS_CNZZ_ID}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${ANALYTICS_CNZZ_ID}' type='text/javascript'%3E%3C/script%3E"));
          `
                }}
            />
        )}

        {/* 谷歌统计 */}
        {ANALYTICS_GOOGLE_ID && (<>
            <script async
                src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_GOOGLE_ID}`}
            />
            <script async
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ANALYTICS_GOOGLE_ID}', {
                  page_path: window.location.pathname,
                });
              `
                }}
            />
        </>)}

        {/* Matomo 统计 */}
        {MATOMO_HOST_URL && MATOMO_SITE_ID && (
            <script async dangerouslySetInnerHTML={{
              __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//${MATOMO_HOST_URL}/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `
            }} />
        )}

    </>
}

export default ExternalPlugin

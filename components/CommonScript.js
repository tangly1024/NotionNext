import BLOG from '@/blog.config'

/**
 * 第三方代码 统计脚本
 * @returns {JSX.Element}
 * @constructor
 */
const CommonScript = () => {
  return (<>
    {BLOG.COMMENT_DAO_VOICE_ID && (<>
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
                    app_id: "${BLOG.COMMENT_DAO_VOICE_ID}"
                  });
                  daovoice('update');
                  `
      }}
      />
    </>)}

    {/* GoogleAdsense */}
    {BLOG.ADSENSE_GOOGLE_ID && (<script data-ad-client={BLOG.ADSENSE_GOOGLE_ID} async
              src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'/>)}

    {BLOG.COMMENT_CUSDIS_APP_ID && <script defer src='https://cusdis.com/js/widget/lang/zh-cn.js' />}

    {BLOG.COMMENT_TIDIO_ID && <script async src={`//code.tidio.co/${BLOG.COMMENT_TIDIO_ID}.js`} />}

    {/* gitter聊天室 */}
    {BLOG.COMMENT_GITTER_ROOM && (<>
      <script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer/>
      <script async dangerouslySetInnerHTML={{
        __html: `
                ((window.gitter = {}).chat = {}).options = {
                  room: '${BLOG.COMMENT_GITTER_ROOM}'
                };
                `
      }}/>
    </>)}

    {/* 代码统计 */}
    {/* ackee统计脚本 */}
    {BLOG.ANALYTICS_ACKEE_TRACKER && (
      <script async src={BLOG.ANALYTICS_ACKEE_TRACKER}
              data-ackee-server={BLOG.ANALYTICS_ACKEE_DATA_SERVER}
              data-ackee-domain-id={BLOG.ANALYTICS_ACKEE_DOMAIN_ID}
      />
    )}

    {/* 百度统计 */}
    {BLOG.ANALYTICS_BAIDU_ID && (
      <script async
              dangerouslySetInnerHTML={{
                __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?${BLOG.ANALYTICS_BAIDU_ID}";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
              `
              }}
      />
    )}

    {/* 站长统计 */}
    {BLOG.ANALYTICS_CNZZ_ID && (
      <script async
              dangerouslySetInnerHTML={{
                __html: `
              document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${BLOG.ANALYTICS_CNZZ_ID}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${BLOG.ANALYTICS_CNZZ_ID}' type='text/javascript'%3E%3C/script%3E"));
              `
              }}
      />
    )}

    {/* 谷歌统计 */}
    {BLOG.ANALYTICS_GOOGLE_ID && (<>
      <script async
              src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.ANALYTICS_GOOGLE_ID}`}
      />
      <script async
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${BLOG.ANALYTICS_GOOGLE_ID}', {
                      page_path: window.location.pathname,
                    });
                  `
              }}
      />
    </>)}
  </>)
}

export default CommonScript

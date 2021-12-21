import BLOG from '@/blog.config'

/**
 * 第三方代码 统计脚本
 * @returns {JSX.Element}
 * @constructor
 */
const ThirdPartyScript = () => {
  return (<>
    {BLOG.DaoVoiceId && (<>
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
                    app_id: "${BLOG.DaoVoiceId}"
                  });
                  daovoice('update');
                  `
      }}
      />
    </>)}

    {/* GoogleAdsense 广告植入 */}
    {BLOG.googleAdsenseId && (<script data-ad-client={BLOG.googleAdsenseId} async
              src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'/>)}

    {BLOG.TidioId && (<>
      {/* Tidio在线反馈 */}
      <script async
              src={`//code.tidio.co/${BLOG.TidioId}.js`}
      />
    </>)}

    {/* 代码统计 */}
    {BLOG.isProd && (<>

        {/* ackee统计脚本 */}
        {BLOG.analytics.provider === 'ackee' && (
          <script async src={BLOG.analytics.ackeeConfig.tracker}
                  data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
                  data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
          />
        )}
        {/* 百度统计 */}
        {BLOG.analytics.baiduAnalytics && (
          <script async
                  dangerouslySetInnerHTML={{
                    __html: `
                  var _hmt = _hmt || [];
                  (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?${BLOG.analytics.baiduAnalytics}";
                    var s = document.getElementsByTagName("script")[0]; 
                    s.parentNode.insertBefore(hm, s);
                  })();
                  `
                  }}
          />
        )}

        {/* 站长统计 */}
        {BLOG.analytics.cnzzAnalytics && (
          <script async
                  dangerouslySetInnerHTML={{
                    __html: `
                  document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${BLOG.analytics.cnzzAnalytics}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${BLOG.analytics.cnzzAnalytics}' type='text/javascript'%3E%3C/script%3E"));
                  `
                  }}
          />
        )}

        {/* 谷歌统计 */}
        {BLOG.analytics.provider === 'ga' && (<>
            <script async
                    src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
            />
            <script async
                    dangerouslySetInnerHTML={{
                      __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
                          page_path: window.location.pathname,
                        });
                      `
                    }}
            />
          </>)}
      </>)}
  </>)
}

export default ThirdPartyScript

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
  </>)
}

export default CommonScript

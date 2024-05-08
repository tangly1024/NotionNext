import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { generateRss } from '@/lib/rss'
import { getLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({
    theme: siteConfig('THEME'),
    router: useRouter()
  })
  return <Layout {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await getGlobalData({ from, locale })

  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(0, siteConfig('POSTS_PER_PAGE'))
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW')) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(
        post.id,
        'slug',
        siteConfig('POST_PREVIEW_LINES')
      )
    }
  }

  // 生成robotTxt
  generateRobotsTxt()
  // 生成Feed订阅
  if (JSON.parse(BLOG.ENABLE_RSS)) {
    generateRss(props?.NOTION_CONFIG, props?.latestPosts || [])
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: siteConfig(
      'NEXT_REVALIDATE_SECOND',
      BLOG.NEXT_REVALIDATE_SECOND,
      props.NOTION_CONFIG
    )
  }
}

<!--live2d start-->
    <!-- Load TweenLite -->
    <script src="https://file.qwq.link/live2d/TweenLite.js"></script>

    <!-- Copyrighted cubism SDK -->
    <script src="https://file.qwq.link/live2d/live2dcubismcore.min.js"></script>
    <!-- Load Pixi (dependency for cubism 2/4 integrated loader) -->
    <script src="https://file.qwq.link/live2d/pixi.min.js"></script>
    <!-- Load cubism 4 integrated loader -->
    <script src="https://file.qwq.link/live2d/cubism4.min.js"></script>

    <!-- Load pio and alternative loader -->
    <link href="https://file.qwq.link/live2d/pio.css" rel="stylesheet"
          type="text/css"/>
    <script src="https://file.qwq.link/live2d/pio.js"></script>
    <script src="https://file.qwq.link/live2d/pio_sdk4.js"></script>
    <!-- 嘉然 -->
    <script src="https://file.qwq.link/live2d/model/Diana/load.js"></script>

    <!--live2d 夜间模式控件-->
    <script>
        function toggleNightMode() {
            if ( $('body').hasClass('dark')) {
                $('body').removeClass('dark');
            } else {
                $('body').addClass('dark');
            }
        }
    </script>
    <style>
        #pio {
            width: 14rem !important;
            height: 14rem !important;
        }

        #pio-container {
            width: auto !important;
            z-index: 999;
        }

        .pio-action {
            top: unset !important;
            transform: translateX(20px);
            overflow: hidden;
        }

        .pio-container .pio-dialog {
            top: -5em !important;
        }
    </style>
<!--live2d end-->

export default Index

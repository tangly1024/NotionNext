import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'
import { useRouter } from 'next/router'

const CasesPage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'

  return (
    <StaticContentPage
      title={isEnglish ? 'AI Case Studies' : 'AI案例分享'}
      updatedAt={
        isEnglish
          ? 'Last updated on April 28, 2026.'
          : '最后更新于 2026 年 4 月 28 日。'
      }
      sections={
        isEnglish
          ? [
              {
                paragraphs: [
                  'This page collects breakdowns of real AI use cases. The point is not to showcase abstract ideas, but to see how tools actually land inside business workflows, content systems, and research processes.',
                  'If you are deciding whether a class of AI tools deserves a place in a team or solo workflow, these case studies should be more useful than generic product summaries.'
                ]
              },
              {
                heading: 'What kinds of cases matter here',
                items: [
                  'Content production and distribution: writing, topic planning, scripts, SEO, and repurposing',
                  'Research and knowledge work: retrieval, summarization, paper reading, and note systems',
                  'Marketing and growth: asset generation, automation, and conversion-path improvement',
                  'Small-team operations: lightweight workflows, cost control, and tool combinations'
                ]
              },
              {
                heading: 'How value is judged',
                items: [
                  'It should solve a real problem instead of merely looking intelligent',
                  'It should be repeatable, not a one-off demo',
                  'The setup, learning, and maintenance cost should make sense',
                  'It should be usable for solo operators or small teams in practice'
                ]
              },
              {
                heading: 'Where to go next',
                paragraphs: [
                  'Use /tools, /tag, and /search to drill into specific tools, topics, and articles.',
                  'If you want more theory or study direction, continue to /paper, /basicai, and /learning.'
                ]
              }
            ]
          : [
        {
          paragraphs: [
            '这个页面汇总 CharliiAI 对真实 AI 应用场景的拆解，重点不是概念展示，而是看产品在具体业务、内容和研究流程里怎么落地。',
            '如果你正在评估某类 AI 工具是否值得引入团队或个人工作流，这里会比泛泛的产品介绍更有参考价值。'
          ]
        },
        {
          heading: '重点关注的案例类型',
          items: [
            '内容生产与分发：写作、选题、脚本、SEO、内容复用',
            '研究与知识工作：检索、总结、论文阅读、笔记沉淀',
            '营销与增长：素材生成、自动化流程、转化路径优化',
            '小团队协作：轻量工作流、成本控制、工具组合方式'
          ]
        },
        {
          heading: '我们怎么判断一个案例有没有价值',
          items: [
            '是不是能解决明确问题，而不是只是“看起来很智能”',
            '能不能重复执行，而不是一次性的演示效果',
            '投入成本、学习成本和维护成本是否合理',
            '对个人创作者或小团队是否真的可用'
          ]
        },
        {
          heading: '继续浏览',
          paragraphs: [
            '你可以结合站内的 /tools、/tag 和 /search 页面继续找具体工具、主题和相关文章。',
            '如果你想看更偏研究、理论或学习路径的内容，也可以继续访问 /paper、/basicai 和 /learning。'
          ]
        }
            ]
      }
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'cases-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'AI Case Studies | CharliiAI' : 'AI案例分享 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'Case studies on how AI lands in content, research, growth, and small-team workflows.'
        : '汇总 AI 在内容、研究、增长和小团队工作流中的实际案例与落地思路。',
    pageCover: '/bg_image.jpg',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/cases`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default CasesPage

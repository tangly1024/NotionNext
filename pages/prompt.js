import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'

const PromptPage = () => {
  return (
    <StaticContentPage
      title='AI提示词'
      updatedAt='最后更新于 2026 年 4 月 28 日。'
      sections={[
        {
          paragraphs: [
            '这个页面聚焦提示词的实际使用，而不是把它当成“万能咒语”。好的提示词本质上是在帮模型理解任务、边界、输出格式和判断标准。',
            '比起收集大量模板，更重要的是知道什么时候该补上下文，什么时候该拆步骤，什么时候应该直接改工作流而不是继续堆提示词。'
          ]
        },
        {
          heading: '常见提示词场景',
          items: [
            '内容写作、改写、总结与结构化输出',
            '研究检索、文档问答、笔记整理',
            '自动化流程中的分类、抽取和格式约束',
            '多步任务中的角色设定与过程控制'
          ]
        },
        {
          heading: '写提示词时最值得注意的事',
          items: [
            '先把任务目标写清楚，再补输入背景',
            '输出格式要明确，尤其是 JSON、表格和步骤清单',
            '遇到效果不稳定时，优先缩小任务范围',
            '如果同一个提示词反复修不稳，往往该改流程，不该继续加词'
          ]
        },
        {
          heading: '继续浏览',
          paragraphs: [
            '如果你想把提示词放进真实工作流，可以继续看 /cases 和 /tools。',
            '如果你更想理解底层原理，接着看 /basicai 会更有效。'
          ]
        }
      ]}
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'prompt-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'AI提示词 | AI博士Charlii',
    description: '整理 AI 提示词的常见场景、编写原则与如何接入真实工作流。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/prompt'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default PromptPage

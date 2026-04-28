import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'

const BasicAiPage = () => {
  return (
    <StaticContentPage
      title='AI理论基础'
      updatedAt='最后更新于 2026 年 4 月 28 日。'
      sections={[
        {
          paragraphs: [
            '这个页面适合想补 AI 基础但不想一上来就掉进公式和术语海里的读者。',
            '内容会尽量用更直接的方式解释常见概念，让你先建立判断框架，再决定要不要深入到论文、课程或代码。'
          ]
        },
        {
          heading: '通常会涉及的基础主题',
          items: [
            'Transformer、Embedding、RAG、Agent 等核心概念',
            '大模型是怎么训练、推理和对齐的',
            '为什么同一种模型在不同产品里体验差异会很大',
            '常见误区：幻觉、上下文窗口、工具调用、工作流依赖'
          ]
        },
        {
          heading: '阅读建议',
          items: [
            '先理解概念之间的关系，再追求细节',
            '看到新产品时，优先判断它本质上解决的是什么问题',
            '把理论和实际工具体验对应起来，理解会更快'
          ]
        },
        {
          heading: '继续浏览',
          paragraphs: [
            '如果你已经有基础，下一步可以去 /paper 看研究进展，或者去 /cases 看具体应用。',
            '如果你更需要成体系的学习路径，可以继续看 /learning。'
          ]
        }
      ]}
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'basicai-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'AI理论基础 | AI博士Charlii',
    description: '面向入门和进阶读者整理 AI 基础概念、判断框架与常见误区。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/basicai'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default BasicAiPage

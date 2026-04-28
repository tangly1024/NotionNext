import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'

const LearningPage = () => {
  return (
    <StaticContentPage
      title='AI课程学习'
      updatedAt='最后更新于 2026 年 4 月 28 日。'
      sections={[
        {
          paragraphs: [
            '这个页面用于整理 AI 学习路径，而不是单纯堆课程链接。核心目标是帮你判断“先学什么、为什么学、学到什么程度够用”。',
            '无论你是内容从业者、产品人、开发者还是研究型读者，都可以先从适合自己目标的路径开始。'
          ]
        },
        {
          heading: '常见学习目标',
          items: [
            '理解 AI 基本原理，建立概念框架',
            '学会把 AI 工具接入实际工作流',
            '跟进论文和研究趋势，提升判断力',
            '为内容创作、自动化或产品开发打基础'
          ]
        },
        {
          heading: '建议的学习顺序',
          items: [
            '先补基础概念：模型、提示词、检索、Agent、自动化',
            '再上手常用工具，形成真实使用感',
            '然后进入论文、案例和专题深挖',
            '最后根据方向继续走开发、研究或商业化路径'
          ]
        },
        {
          heading: '继续浏览',
          paragraphs: [
            '如果你正在补基础，可以先看 /basicai；如果你想看更真实的落地方式，可以去 /cases。',
            '需要查找具体文章时，可以直接用 /search 或按 /tag 浏览。'
          ]
        }
      ]}
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'learning-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'AI课程学习 | AI博士Charlii',
    description: '整理 AI 学习目标、进阶顺序与适合不同角色的内容路径。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/learning'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default LearningPage

import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'

const PaperPage = () => {
  return (
    <StaticContentPage
      title='AI+论文'
      updatedAt='最后更新于 2026 年 4 月 28 日。'
      sections={[
        {
          paragraphs: [
            '这个页面面向想系统跟进 AI 论文、研究报告和方法演进的读者。重点是把“论文很多、信息很散”这件事，收束成更容易持续追踪的阅读路径。',
            '如果你更关心的是研究对产品、工作流和实际应用会带来什么影响，这个栏目会更适合你。'
          ]
        },
        {
          heading: '常见内容方向',
          items: [
            '重要论文的核心观点与直白解释',
            '研究趋势整理：多模态、Agent、RAG、视频生成、语音等',
            '论文到产品的映射：哪些能力已经进入工具，哪些还停留在实验阶段',
            '研究阅读工作流：怎么筛选、记笔记、建立长期跟踪机制'
          ]
        },
        {
          heading: '适合谁看',
          items: [
            '想理解 AI 技术脉络的创作者和产品人',
            '想跟进论文但没有完整学术背景的读者',
            '需要把研究变化转成业务判断的运营、创业者和小团队'
          ]
        },
        {
          heading: '继续浏览',
          paragraphs: [
            '你可以继续查看 /archive 里的历史内容，或者用 /tag 和 /search 按主题追踪相关论文与工具。',
            '如果你更想先补理论基础，可以接着看 /basicai；如果想看学习路径，可以看 /learning。'
          ]
        }
      ]}
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'paper-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'AI+论文 | AI博士Charlii',
    description: '围绕 AI 论文、研究趋势与论文到产品落地的连接方式整理内容。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/paper'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default PaperPage

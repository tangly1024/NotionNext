import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import StaticContentPage from '@/components/StaticContentPage'
import { useRouter } from 'next/router'

const BasicAiPage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'

  return (
    <StaticContentPage
      title={isEnglish ? 'AI Foundations' : 'AI理论基础'}
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
                  'This page is for readers who want AI foundations without being dropped straight into equations and jargon.',
                  'The goal is to explain common concepts in direct language so you can build a judgment framework first, then decide whether to go deeper into papers, courses, or code.'
                ]
              },
              {
                heading: 'Core foundation topics',
                items: [
                  'Concepts such as Transformers, embeddings, RAG, and agents',
                  'How large models are trained, run, and aligned',
                  'Why the same base model can feel very different across products',
                  'Common misunderstandings around hallucinations, context windows, tool use, and workflow dependence'
                ]
              },
              {
                heading: 'Reading advice',
                items: [
                  'Understand the relationships between ideas before chasing edge details',
                  'When you see a new product, first ask what problem it actually solves',
                  'Pair theory with hands-on tool usage if you want the concepts to stick'
                ]
              },
              {
                heading: 'Where to go next',
                paragraphs: [
                  'If you already have the basics, move to /paper for research progress or /cases for applied examples.',
                  'If you want a more structured study path, continue to /learning.'
                ]
              }
            ]
          : [
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
            ]
      }
    />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'basicai-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'AI Foundations | CharliiAI' : 'AI理论基础 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'AI foundations for readers who want core concepts, judgment frameworks, and fewer empty buzzwords.'
        : '面向入门和进阶读者整理 AI 基础概念、判断框架与常见误区。',
    pageCover: '/bg_image.jpg',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/basicai`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default BasicAiPage

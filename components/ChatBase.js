import BLOG from '@/blog.config'

/**
 * 这是一个嵌入组件，可以在任意位置全屏显示您的chat-base对话框
 * 暂时没有页面引用
 * 因为您可以直接用内嵌网页的方式放入您的notion中 https://www.chatbase.co/chatbot-iframe/${BLOG.CHATBASE_ID}
 */
export default function ChatBase() {
  if (!BLOG.CHATBASE_ID) {
    return <></>
  }

  return <iframe
        src={`https://www.chatbase.co/chatbot-iframe/${BLOG.CHATBASE_ID}`}
        width="100%"
        style={{ height: '100%', minHeight: '700px' }}
        frameborder="0"
    ></iframe>
}

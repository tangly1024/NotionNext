import BLOG from '@/blog.config'

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

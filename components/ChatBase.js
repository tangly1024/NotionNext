import { siteConfig } from '@/lib/config'

/**
 * 这是一个嵌入组件，可以在任意位置全屏显示您的chat-base对话框
 * 暂时没有页面引用
 * 因为您可以直接用内嵌网页的方式放入您的notion中 https://www.chatbase.co/chatbot-iframe/${siteConfig('CHATBASE_ID')}
 */
export default function ChatBase() {
  if (!siteConfig('CHATBASE_ID')) {
    return <></>
  }

   return (
    <div>
      <script>
        {`
          window.difyChatbotConfig = {
            token: 'tpn8UiMlmLEnZq2x',
            baseUrl: 'https://sknote.skillre.online:44335'
          }
        `}
      </script>
      <script
        src="https://sknote.skillre.online:44335/embed.min.js"
        id="tpn8UiMlmLEnZq2x"
        defer
      ></script>
      <style>
        {`
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}
      </style>
    </div>
  );
}

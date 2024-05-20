import { useEffect } from 'react';
import { siteConfig } from '@/lib/config';

export default function DifyChatbot() {
  useEffect(() => {
    // 这里使用 siteConfig() 函数调用来获取配置值
    if (!siteConfig('DIFY_CHATBOT_ENABLED')) {
      return;
    }

    // 配置 DifyChatbot，同样需要调用 siteConfig() 获取相应的配置值
    window.difyChatbotConfig = {
      token: siteConfig('DIFY_CHATBOT_TOKEN'),
      baseUrl: siteConfig('DIFY_CHATBOT_BASE_URL')
    };

    // 加载 DifyChatbot 脚本
    const script = document.createElement('script');
    script.src = `${siteConfig('DIFY_CHATBOT_BASE_URL')}/embed.min.js`; // 注意调用 siteConfig()
    script.id = siteConfig('DIFY_CHATBOT_TOKEN'); // 注意调用 siteConfig()
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // 在组件卸载时清理 script 标签
      const existingScript = document.getElementById(siteConfig('DIFY_CHATBOT_TOKEN')); // 注意调用 siteConfig()
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []); // 注意依赖数组为空，意味着脚本将仅在加载页面时执行一次

  return null;
}

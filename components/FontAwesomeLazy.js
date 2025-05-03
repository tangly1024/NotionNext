import Script from 'next/script'
import BLOG from '@/blog.config'

/**
 * FontAwesome懒加载组件
 * 使用Next.js的Script组件，确保在浏览器空闲时才加载FontAwesome
 */
export default function FontAwesomeLazy() {

  return (
    <Script
      id="font-awesome"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // 检查是否已经存在FontAwesome元素，避免重复加载
            if (document.getElementById('font-awesome-css')) return;

            // 创建link元素
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '${BLOG.FONT_AWESOME}';
            link.id = 'font-awesome-css';
            link.crossOrigin = 'anonymous';
            link.referrerPolicy = 'no-referrer';

            // 添加到head
            document.head.appendChild(link);
          })();
        `
      }}
    />
  )
}

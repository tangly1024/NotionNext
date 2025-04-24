import Script from 'next/script'

/**
 * 流量统计组件
 * 使用 Next.js 的 Script 组件加载流量统计代码
 * strategy="afterInteractive" 确保在页面可交互后加载，不阻塞渲染
 */
const TrafficStats = () => {
  return (
    <Script
      id="traffic-stats-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            // 使用 Next.js Script 组件的 afterInteractive 策略，不需要手动 setTimeout
            var fullres = document.createElement('script');
            fullres.async = true;
            // 关键点：这里的 src 指向你的 Cloudflare Worker 代理路径，并包含你的 Site Key 作为文件名部分
            // 域名: fullkaires.985864.xyz
            // 路径: fullkaires
            // Site Key: blog985864
            fullres.src = 'https://fullkaires.985864.xyz/fullkaires/blog985864.js?' + (new Date() - new Date() % 43200000);

            // 关键点：添加 siteKeyOverride 属性，使用标准的 setAttribute 方法
            fullres.setAttribute('siteKeyOverride', 'blog985864'); // 你的 Site Key

            // 将脚本添加到 head 中
            document.head.appendChild(fullres);
          })();
        `
      }}
    />
  )
}

export default TrafficStats

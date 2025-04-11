import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * iconfont
 */
export default function IconFont() {
    const router = useRouter()

    useEffect(() => {
        loadExternalResource('/webfonts/iconfont.js')
            .then(u => {
                console.log('iconfont loaded');

                // 查找所有 <i> 标签且 class 包含 'icon-'
                const iElements = document.querySelectorAll('i[class*="icon-"]');
                iElements.forEach(element => {
                    const className = Array.from(element.classList).find(cls => cls.startsWith('icon-'));
                    if (className) {
                        // 创建新的 <svg> 元素
                        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgElement.setAttribute('class', 'icon');
                        svgElement.setAttribute('aria-hidden', 'true');

                        const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                        useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${className}`);
                        svgElement.appendChild(useElement);

                        // 替换原来的 <i> 元素
                        element.replaceWith(svgElement);
                        console.log(`Replaced <i> with class "${className}" to <svg>`);
                    }
                });
            })
            .catch(error => {
                console.warn('Failed to load iconfont.js:', error);
            });
    }, [router]);

    return <style jsx global>
        {`
        .icon {
            width: 1.1em;
            height: 1.1em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
        }

        svg.icon {
            display: inline;
        }
        `}</style>
}

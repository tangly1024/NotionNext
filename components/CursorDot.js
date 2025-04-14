import { RouteMatcher } from 'next/dist/server/future/route-matchers/route-matcher';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CursorDot = () => {
    const router = useRouter();
    useEffect(() => {
        // 创建小白点元素
        const dot = document.createElement('div');
        dot.classList.add('cursor-dot');
        document.body.appendChild(dot);

        // 鼠标坐标和缓动目标坐标
        let mouse = { x: -100, y: -100 }; // 初始位置在屏幕外
        let dotPos = { x: mouse.x, y: mouse.y };

        // 监听鼠标移动
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // 监听鼠标悬停在可点击对象上的事件
        const handleMouseEnter = () => {
            dot.classList.add('cursor-dot-hover'); // 添加放大样式
        };
        const handleMouseLeave = () => {
            dot.classList.remove('cursor-dot-hover'); // 移除放大样式
        };


        // 为所有可点击元素和包含 hover 或 group-hover 类名的元素添加事件监听
        const clickableElements = document.querySelectorAll(
            'a, button, [role="button"], [onclick], [cursor="pointer"], [class*="hover"], [class*="group-hover"], [class*="cursor-pointer"]'
        );
        clickableElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // 动画循环：延迟更新小白点位置
        const updateDotPosition = () => {
            const damping = 0.2; // 阻尼系数，值越小延迟越明显
            dotPos.x += (mouse.x - dotPos.x) * damping;
            dotPos.y += (mouse.y - dotPos.y) * damping;

            // 更新DOM
            dot.style.left = `${dotPos.x}px`;
            dot.style.top = `${dotPos.y}px`;

            requestAnimationFrame(updateDotPosition);
        };

        // 启动动画
        updateDotPosition();

        // 清理函数
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            clickableElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            document.body.removeChild(dot);
        };
    }, [router]);

    return (
        <style jsx global>{`
            .cursor-dot {
                position: fixed;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 9999;
                transition: transform 100ms ease-out, width 200ms ease, height 200ms ease; /* 添加尺寸平滑过渡 */
                mix-blend-mode: difference; /* 可选：增强对比度 */
            }

            .cursor-dot-hover {
                border: 1px solid rgba(167, 167, 167, 0.14); /* 鼠标悬停时的深灰色边框，厚度为1px */
                width: 60px; /* 放大 */
                height: 60px; /* 放大 */
                background: hsla(0, 0%, 100%, 0.04); /* 半透明背景 */
                -webkit-backdrop-filter: blur(5px); /* 毛玻璃效果 */
                backdrop-filter: blur(5px);
            }

            .dark .cursor-dot-hover {
                border: 1px solid rgba(66, 66, 66, 0.66); /* 鼠标悬停时的深灰色边框，厚度为1px */
            }
        `}</style>
    );
};

export default CursorDot;
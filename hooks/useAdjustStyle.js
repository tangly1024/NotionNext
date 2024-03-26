import { useEffect } from 'react';

/**
 * 样式调整的补丁
 */
const useAdjustStyle = () => {

    // 避免 callout 含有图片时溢出撑开父容器
    useEffect(() => {
        const adjustCalloutImg = () => {
            const callOuts = document.querySelectorAll('.notion-callout-text');
            callOuts.forEach((callout) => {
                const images = callout.querySelectorAll('figure.notion-asset-wrapper.notion-asset-wrapper-image > div');
                const calloutWidth = callout.offsetWidth;
                images.forEach((container) => {
                    const imageWidth = container.offsetWidth;
                    if (imageWidth + 50 > calloutWidth) {
                        container.style.setProperty('width', '100%');
                    }
                });
            });
        };

        adjustCalloutImg();

        window.addEventListener('resize', adjustCalloutImg);
        return () => {
            window.removeEventListener('resize', adjustCalloutImg);
        };
    }, []);

    // 强行移除 react-notion-x 表格表头第一行样式
    useEffect(() => {
        for (let i = 0; i < document.styleSheets.length; i++) {
            const styleSheet = document.styleSheets[i];
            if (styleSheet.href && styleSheet.href.includes('fonts.googleapis.com')) {
                continue; // 忽略指定样式表，避免访问报错
            }
            try {
                const rules = styleSheet.cssRules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.selectorText === '.notion-simple-table tr:first-child td') {
                        styleSheet.deleteRule(j);
                        break;
                    }
                }
            } catch (error) {
                console.error('Error accessing stylesheets:', error);
            }
        }
        return () => {
        };
    }, []);
    
};

export default useAdjustStyle;

import { isBrowser } from '@/lib/utils';
import { useEffect } from 'react';

const useAdjustStyle = () => {
    /**
     * 避免 callout 含有图片时溢出撑开父容器
     */
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

    useEffect(() => {
        if (isBrowser) {
            adjustCalloutImg();
            window.addEventListener('resize', adjustCalloutImg);
            return () => {
                window.removeEventListener('resize', adjustCalloutImg);
            };
        }
    }, []);
};

export default useAdjustStyle;

import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const typingDelay = 25;
    const punctuationDelayMultiplier = 6;

    useEffect(() => {
        setDisplayedText(''); // 重置 displayedText
        setIsFinished(false); // 重置完成状态
        let currentIndex = 0;
        let lastUpdateTime = performance.now();
        let animationFrameId;

        const animate = () => {
            if (currentIndex < text.length) {
                const currentTime = performance.now();
                const timeDiff = currentTime - lastUpdateTime;
                const letter = text.charAt(currentIndex);
                const isPunctuation = /[，。！、？,.!?]/.test(letter);
                const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

                if (timeDiff >= delay) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    lastUpdateTime = currentTime;
                    currentIndex++;
                }

                animationFrameId = requestAnimationFrame(animate);
            } else {
                setIsFinished(true);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId); // 清理函数，组件卸载时或依赖变化时停止动画
        };
    }, [text]); // 当 text 变化时重启动画

    return (
        <div>
            {displayedText}
            {!isFinished && <span className="blinking-cursor"></span>}
        </div>
    );
};

const AISummary = ({post}) => {
    const summary = post.AISummary;

    if (!summary) {
        return <></>
    }

    return (
        <div id="AI-Summary" className = "mx-auto overflow-hidden px-8">
        <div className="bg-ai-bg rounded-lg p-3 border-ai-card my-4 leading-[1.4] md:mt-6 mx-auto overflow-hidden">
            <div id="AI-Title" className="flex items-center rounded-md px-2 cursor-default select-none relative text-ai-title">
                <i className="w-5 h-5">
                    <svg width="20px" height="20px" viewBox="0 0 48 48">
                        <title>机器人</title>
                        <g id="机器人" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="形状结合" fill="currentColor" fillRule="nonzero"></path>
                        </g>
                    </svg>
                </i>
                <div className="font-bold ml-2 leading-[1]">AI摘要</div>
                <div id="AI-tag" className="text-xs bg-ai-title text-ai-title-text font-bold rounded p-1 flex items-center justify-center transition-all duration-300 absolute right-2">chengeGPT</div>
            </div>
            <div id="AI-Summary" className="block mt-3 px-3 py-2 bg-ai-card-bg rounded-lg border-ai-card text-[15px] leading-7 text-hexo-front">
                <TypewriterEffect text={summary} />
            </div>
        </div>
        </div>
    )
};

export default AISummary;

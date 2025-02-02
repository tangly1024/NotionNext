// components/DouyinHotList.js
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

const DouyinHotList = () => {
    const [hotList, setHotList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        console.log('useEffect in DouyinHotList is executed');

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://api.vvhan.com/api/hotlist/douyinHot');
                console.log('API Response:', response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Data:', data);
                setHotList(data.data);
                console.log('hotList:', data.data);  // 调试信息：打印 hotList

            } catch (err) {
                setError(err);
                console.error('Error fetching Douyin hot list:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("循环滚动 useEffect 执行");
        if (scrollRef.current && hotList && hotList.length > 0) {
            const scrollContainer = scrollRef.current;
            const scrollHeight = scrollContainer.scrollHeight;
            const containerHeight = containerRef.current.offsetHeight;
            let currentScroll = 0;
            const animationSpeed = 20; // Adjust as needed

            const animateScroll = () => {
                currentScroll += 1;
                scrollContainer.scrollTop = currentScroll;

                if (currentScroll > scrollHeight - containerHeight) {
                   currentScroll = 0;
                   scrollContainer.scrollTop = 0;
                }
                requestAnimationFrame(animateScroll);
            };

            animateScroll();
        }
    }, [hotList]);



    if (loading) {
        console.log("DouyinHotList is loading")
        return (
            <Card className='bg-white dark:bg-[#1e1e1e]  dark:border-gray-700 rounded-xl p-4'>
                <p>加载中...</p>
            </Card>
        );
    }

    if (error) {
        console.log("DouyinHotList has error:", error)
        return (
            <Card className='bg-white dark:bg-[#1e1e1e]  dark:border-gray-700 rounded-xl p-4'>
                <p>加载失败,请稍后重试。</p>
            </Card>
        );
    }

    console.log("DouyinHotList is render with data:", hotList)

    const slicedHotList = hotList.slice(0, 10);

    return (
        <Card className='bg-white dark:bg-[#1e1e1e]  dark:border-gray-700 rounded-xl '>
            <div className='flex items-center p-4 border-b dark:border-gray-700'>
                <i className="fa-brands fa-tiktok text-xl mr-2" />
                <h2 className="text-xl font-bold">抖音热点榜</h2>
            </div>
            <div className="overflow-y-hidden relative" style={{ maxHeight: '300px' }} ref={containerRef}>
                <ul className="relative" ref={scrollRef}>
                    {slicedHotList.map((item, index) => (
                        <li key={index} className="py-2 border-b dark:border-gray-700">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-yellow-600">
                                <span className="text-gray-500 mr-2">{index + 1}.</span>
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export default DouyinHotList;

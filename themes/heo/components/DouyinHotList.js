// components/DouyinHotList.js
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import ScrollContainer from './ScrollContainer';

const DouyinHotList = () => {
    const [hotList, setHotList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
   const animationRef = useRef(null);

    useEffect(() => {
        console.log('useEffect in DouyinHotList is executed');

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://api.98dou.cn/api/hotlist/dy?apiKey=c45bd7e842be4bc34acf1da24cc051f0');
                console.log('API Response:', response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Data:', data);
                setHotList(data.data);
                  console.log('hotList:', data.data);
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
             let currentScroll = 0;
              const animateScroll = () => {
                 if(!scrollRef.current) return;
                    currentScroll +=1;
                   scrollContainer.scrollTop = currentScroll;

                    if(currentScroll > scrollHeight){
                       currentScroll = 0;
                      scrollContainer.scrollTop = 0;
                     }
                   animationRef.current = requestAnimationFrame(animateScroll);
               };
              animationRef.current =  requestAnimationFrame(animateScroll);
              const handleScroll = (e) => {
                   if(animationRef.current){
                       cancelAnimationFrame(animationRef.current);
                   }
                    animationRef.current = requestAnimationFrame(animateScroll);
                    if (e.type === 'wheel') {
                         scrollContainer.scrollTop += e.deltaY;
                   }
               };
             scrollContainer.addEventListener('wheel', handleScroll);
                return () => {
                  if(scrollContainer){
                    scrollContainer.removeEventListener('wheel', handleScroll);
                      cancelAnimationFrame(animationRef.current);
                 }
               };
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


    return (
        <Card className='bg-white dark:bg-[#1e1e1e]  dark:border-gray-700 rounded-xl max-h-[450px] overflow-hidden'>
            <div className='flex items-center p-4 border-b dark:border-gray-700'>
                <i className="fa-brands fa-tiktok text-xl mr-2" />
                <h2 className="text-xl font-bold text-gray-700 dark:text-white">抖音热搜榜</h2>{/* 添加 text-gray-700 dark:text-white */}
            </div>
            <ScrollContainer maxHeight="375px">
                <ul className="relative" ref={scrollRef}>
                    {hotList.map((item, index) => (
                       <li key={index} className="py-2 border-b dark:border-gray-700 " style={{ whiteSpace: 'nowrap' }}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-yellow-600  line-clamp-2 text-gray-700 dark:text-gray-200"> {/* 添加 text-gray-700 dark:text-gray-200 */}
                                <span className="text-gray-500  mr-2 dark:text-gray-500">{index + 1}.</span>
                                  {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </ScrollContainer>
        </Card>
    );
};

export default DouyinHotList;

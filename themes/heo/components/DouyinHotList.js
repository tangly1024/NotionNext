// components/DouyinHotList.js
import React, { useState, useEffect } from 'react';
import Card from './Card'; // 假设你已经有了 Card 组件

const DouyinHotList = () => {
  const [hotList, setHotList] = useState([]);
  const [loading, setLoading] = useState(true); // 添加加载状态
  const [error, setError] = useState(null); // 添加错误状态

  useEffect(() => {
    console.log('useEffect in DouyinHotList is executed'); // 调试信息：检查 useEffect 是否执行

    const fetchData = async () => {
      setLoading(true);
      setError(null); // 清除之前的错误
      try {
        const response = await fetch('https://api.vvhan.com/api/hotlist/douyinHot');
         console.log('API Response:', response); // 调试信息: 打印响应对象

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         console.log('API Data:', data); // 调试信息: 打印 API 返回的 JSON 数据
        setHotList(data.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching Douyin hot list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      console.log("DouyinHotList is loading")  // 调试信息：加载状态
    return (
      <Card className='bg-white dark:bg-[#1e1e1e] dark:text-white p-4 border border-red-500'>
        <p>加载中...</p>
      </Card>
    );
  }

  if (error) {
    console.log("DouyinHotList has error:", error)  // 调试信息：错误状态
     return (
      <Card className='bg-white dark:bg-[#1e1e1e] dark:text-white p-4 border border-red-500'>
         <p>加载失败,请稍后重试。</p>
      </Card>
    );
  }

  console.log("DouyinHotList is render with data:", hotList)   // 调试信息：数据加载完成

  return (
    <Card className='bg-white dark:bg-[#1e1e1e] dark:text-white border border-red-500'>
       <h2 className="text-xl font-bold p-4  border-b dark:border-gray-700">抖音热点榜</h2>
      <ul className="p-2 ">
        {hotList.map((item, index) => (
          <li key={index} className="py-2 border-b dark:border-gray-700">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-yellow-600">
                <span className="text-gray-500  mr-2">{index + 1}.</span>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DouyinHotList;

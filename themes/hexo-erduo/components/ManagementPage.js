import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NotionAPI } from 'notion-api-js';

const ManagementPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 在此处进行登录验证，如果未登录则重定向到登录页面
    // ...

    // 使用 Notion API 获取文章列表
    const loadPosts = async () => {
      const notion = new NotionAPI();
      const databaseId = 'YOUR_DATABASE_ID'; // 替换为您的 Notion 数据库 ID

      try {
        const response = await notion.getDatabaseEntries({
          databaseId: databaseId,
        });
        setPosts(response.results);
      } catch (error) {
        console.error('Error while fetching posts:', error);
      }
    };

    loadPosts();
  }, []);

  return (
    <div>
      <h2>管理页面</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.properties.title.title[0].plain_text}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManagementPage;
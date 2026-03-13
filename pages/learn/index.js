// /pages/learn/index.js
import fs from 'fs';
import path from 'path';

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'data', 'categories.json');
  
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const categories = JSON.parse(jsonData);

    // 如果有分类，就跳转到第一个分类的 ID
    if (categories && categories.length > 0) {
      return {
        redirect: {
          destination: `/learn/${categories[0].id}`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("读取分类失败:", error);
  }

  // 如果读取失败或没有分类，给一个保底的 404 或者错误页
  return { notFound: true };
}

export default function LearnIndex() {
  return null;
}

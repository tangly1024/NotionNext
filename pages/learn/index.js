// /pages/learn/index.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react'; // 如果你没装 lucide-react，请 yarn add lucide-react

export default function CategoryList({ categories }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20 font-sans">
      {/* 顶部标题 */}
      <header className="bg-white px-6 py-6 border-b border-gray-200 sticky top-0 z-50">
        <h1 className="text-2xl font-black text-gray-800 tracking-wider">选择学习模块</h1>
        <p className="text-gray-500 font-bold mt-1 text-sm">按场景分类，突破口语障碍</p>
      </header>

      <main className="max-w-md mx-auto p-4 flex flex-col gap-5 pt-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/learn/${cat.id}`}>
            <div className="relative w-full h-40 rounded-3xl overflow-hidden shadow-lg transform transition active:scale-[0.98] cursor-pointer group">
              
              {/* 背景图 */}
              <img 
                src={cat.bgImage} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* 黑色渐变遮罩 (左深右浅，确保文字清晰) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* 卡片内容 */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                {/* 左上角模块数量标签 */}
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                  {cat.unitCount} 个模块
                </div>

                {/* 底部标题和副标题 */}
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-white text-2xl font-black mb-1 drop-shadow-md">{cat.title}</h2>
                    <p className="text-gray-200 text-sm font-bold opacity-90 drop-shadow-md">{cat.subtitle}</p>
                  </div>
                  
                  {/* 右下角箭头按钮 (类似你图里的灰色圆圈) */}
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <ChevronRight size={18} color="white" />
                  </div>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data/categories.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return { props: { categories: JSON.parse(jsonData) } };
}

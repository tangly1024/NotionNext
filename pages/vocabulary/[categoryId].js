import { useRouter } from 'next/router';
import { vocabCategories } from '@/data/vocabData';

const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function CategoryPage() {
  const router = useRouter();

  if (!router.isReady) return <div style={{ padding: 16 }}>加载中...</div>;

  const categoryId = pick(router.query.categoryId);
  const categoryData = vocabCategories.find((c) => c.id === categoryId) || null;

  if (!categoryData) {
    return <div style={{ padding: 16 }}>分类不存在：{String(categoryId || '')}</div>;
  }

  const handleItemClick = (item) => {
    if (item.locked) return;

    // 用字符串 URL，避免对象 query 在某些场景下不稳定
    router.push(
      `/vocabulary/player?category=${encodeURIComponent(categoryData.id)}&listId=${encodeURIComponent(item.id)}`
    );
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>{categoryData.title}</h1>
      <p>{categoryData.description}</p>

      <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {(categoryData.items || []).map((item) => (
          <button
            key={item.id}
            disabled={item.locked}
            onClick={() => handleItemClick(item)}
            style={{ padding: 12, textAlign: 'left' }}
          >
            {item.title} {item.locked ? '(未解锁)' : ''}
          </button>
        ))}
      </div>
    </main>
  );
}

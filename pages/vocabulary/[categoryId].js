import { useRouter } from 'next/router';
import { vocabCategories } from '@/data/vocabData';

const pick = (v) => (Array.isArray(v) ? v[0] : v);
const getCategoryByIdLocal = (id) =>
  vocabCategories.find((c) => c.id === id) || null;

export default function CategoryPage() {
  const router = useRouter();

  if (!router.isReady) return <div>加载中...</div>;

  const categoryId = pick(router.query.categoryId);
  const categoryData = getCategoryByIdLocal(categoryId);

  if (!categoryData) return <div>分类不存在：{String(categoryId || '')}</div>;

  const handleItemClick = (item) => {
    if (item.locked) return;
    router.push({
      pathname: '/vocabulary/player',
      query: {
        category: categoryData.id,
        listId: item.id,
      },
    });
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

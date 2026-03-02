import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { wordDataMap } from '@/data/words';

const WordCard = dynamic(() => import('@/components/WordCard'), { ssr: false });
const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function VocabularyPlayerPage() {
  const router = useRouter();
  const category = pick(router.query.category);
  const listId = pick(router.query.listId);

  const [words, setWords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    let cancel = false;

    async function run() {
      try {
        setLoading(true);
        setError('');

        if (!category || !listId) throw new Error('缺少参数 category/listId');

        // 关键：按二级分类组合 key
        const loaderKey = `${category}/${listId}`;
        const loader = wordDataMap[loaderKey];
        if (!loader) throw new Error(`未找到词库：${loaderKey}`);

        // 关键：每个二级分类文件直接导出数组
        const list = await loader();
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error(`列表不存在或为空：${loaderKey}`);
        }

        setWords(list);
      } catch (e) {
        if (!cancel) setError(e?.message || '加载失败');
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [router.isReady, category, listId]);

  if (loading) return <div style={{ padding: 20 }}>正在加载词库...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <WordCard
      words={words}
      isOpen={true}
      onClose={() => router.back()}
      progressKey={`vocab_${category}_${listId}`}
    />
  );
}

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
        const loader = wordDataMap[category];
        if (!loader) throw new Error(`未找到分类：${category}`);

        const allLists = await loader();
        const list = allLists[listId];
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error(`列表不存在或为空：${listId}`);
        }

        // 不需要拼音字段，WordCard里会自动生成
        setWords(list);
      } catch (e) {
        if (!cancel) setError(e.message || '加载失败');
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => { cancel = true; };
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

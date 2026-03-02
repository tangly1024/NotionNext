import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { wordDataMap } from '@/data/words';

const WordCard = dynamic(() => import('@/components/WordCard'), { ssr: false });
const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function VocabularyPlayerPage() {
  const router = useRouter();
  const category = pick(router.query.category)?.trim();
  const listId = pick(router.query.listId)?.trim();

  const [words, setWords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError('');
        setWords([]);

        if (!category || !listId) {
          throw new Error('缺少参数 category/listId');
        }

        // 二级分类独立文件：key 形如 "health/hospital"
        const loaderKey = `${category}/${listId}`;
        const loader = wordDataMap?.[loaderKey];

        if (typeof loader !== 'function') {
          throw new Error(`未找到词库：${loaderKey}`);
        }

        // 每个二级文件默认导出数组
        const list = await loader();

        if (!Array.isArray(list)) {
          throw new Error(`词库格式错误（应为数组）：${loaderKey}`);
        }
        if (list.length === 0) {
          throw new Error(`列表为空：${loaderKey}`);
        }

        if (!cancelled) setWords(list);
      } catch (e) {
        if (!cancelled) setError(e?.message || '加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
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

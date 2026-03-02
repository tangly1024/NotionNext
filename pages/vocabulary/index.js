import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { wordDataMap } from '@/data/words';

const WordCard = dynamic(() => import('@/components/WordCard'), { ssr: false });
const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function VocabularyPlayerPage() {
  const router = useRouter();

  const category = useMemo(() => (pick(router.query.category) || '').trim(), [router.query.category]);
  const listId = useMemo(() => (pick(router.query.listId) || '').trim(), [router.query.listId]);

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

        // 注意：这里不抛错，交给页面提示处理
        if (!category || !listId) return;

        const loaderKey = `${category}/${listId}`;
        const loader = wordDataMap?.[loaderKey];

        if (typeof loader !== 'function') {
          throw new Error(`未找到词库：${loaderKey}`);
        }

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

  // 缺参数的友好提示（避免红字报错体验）
  if (router.isReady && (!category || !listId)) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 12 }}>缺少参数，请从分类页进入。</div>
        <Link href="/vocabulary">返回词库首页</Link>
      </div>
    );
  }

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

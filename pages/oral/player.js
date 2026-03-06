'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import OralPhraseBrowser from '@/components/OralPhraseBrowser';
import { oralCategories } from '@/data/oralData';
import { oralDataMap } from '@/data/oral';

const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function OralPlayerPage() {
  const router = useRouter();
  const categoryId = pick(router.query.category);
  const listId = pick(router.query.listId);

  const [loading, setLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [error, setError] = useState('');

  const categoryData = useMemo(() => {
    return oralCategories.find((c) => c.id === categoryId);
  }, [categoryId]);

  const listMeta = useMemo(() => {
    return categoryData?.items?.find((item) => item.id === listId);
  }, [categoryData, listId]);

  useEffect(() => {
    if (!router.isReady || !categoryId || !listId) return;

    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const key = `${categoryId}/${listId}`;
        const loader = oralDataMap[key];

        if (!loader) {
          throw new Error(`未找到口语数据映射：${key}`);
        }

        const data = await loader();

        if (!mounted) return;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.phrases)
          ? data.phrases
          : [];

        setPhrases(list);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || '加载失败');
        setPhrases([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [router.isReady, categoryId, listId]);

  if (!router.isReady) return null;

  if (!categoryData || !listMeta) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>未找到该口语模块</div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>加载中...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#DC2626' }}>{error}</div>
      </main>
    );
  }

  return (
    <OralPhraseBrowser
      categoryTitle={categoryData.title}
      title={listMeta.title}
      subtitle={listMeta.subtitle}
      phrases={phrases}
      accent={categoryData.accent || '#2563EB'}
      icon={listMeta.icon || categoryData.icon || '💬'}
      onBack={() => router.push(`/oral/${categoryData.id}`)}
      favoriteStorageKey={`oral_favs_${categoryData.id}_${listMeta.id}`}
      settingsStorageKey={`oral_settings_${categoryData.id}_${listMeta.id}`}
      secondaryLabel="缅文"
    />
  );
}

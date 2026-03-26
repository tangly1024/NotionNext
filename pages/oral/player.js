import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { oralCategories } from '@/data/oralData';
import { oralDataMap } from '@/data/oral';

const OralPhraseBrowser = dynamic(
  () => import('@/components/OralPhraseBrowser'),
  {
    ssr: false,
    loading: () => (
      <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>加载中...</div>
      </main>
    ),
  }
);

const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function OralPlayerPage() {
  const router = useRouter();
  const categoryId = pick(router.query.category);
  const listId = pick(router.query.listId);

  const [loading, setLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [error, setError] = useState('');

  console.log('[oral] render', {
    query: router.query,
    categoryId,
    listId,
    loading,
    error,
    phrasesLength: phrases.length,
    href: typeof window !== 'undefined' ? window.location.href : '',
  });

  const categoryData = useMemo(() => {
    return oralCategories.find((c) => c.id === categoryId);
  }, [categoryId]);

  const listMeta = useMemo(() => {
    return categoryData?.items?.find((item) => item.id === listId);
  }, [categoryData, listId]);

  useEffect(() => {
    console.log('[oral] effect start', {
      isReady: router.isReady,
      query: router.query,
      categoryId,
      listId,
      href: typeof window !== 'undefined' ? window.location.href : '',
    });

    if (!router.isReady || !categoryId || !listId) {
      console.log('[oral] skip load', {
        isReady: router.isReady,
        categoryId,
        listId,
      });
      return;
    }

    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const key = `${categoryId}/${listId}`;
        console.log('[oral] loading key =', key);

        const loader = oralDataMap[key];
        console.log('[oral] loader exists =', !!loader);

        if (!loader) {
          throw new Error(`未找到口语数据映射：${key}`);
        }

        const url = `/data/oral/${categoryId}/${listId}.json`;
        console.log('[oral] expected url =', url);

        // 先单独 debug 一次直接 fetch，看 CF 实际返回什么
        const debugRes = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        const debugText = await debugRes.text();

        console.log('[oral] debug fetch result', {
          url,
          status: debugRes.status,
          ok: debugRes.ok,
          contentType: debugRes.headers.get('content-type'),
          preview: debugText.slice(0, 200),
        });

        // 再走你原来的 oralDataMap
        const data = await loader();

        if (!mounted) return;

        console.log('[oral] loader data =', data);
        console.log('[oral] loader data type =', {
          isArray: Array.isArray(data),
          itemsIsArray: Array.isArray(data?.items),
          phrasesIsArray: Array.isArray(data?.phrases),
        });

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.phrases)
              ? data.phrases
              : [];

        console.log('[oral] parsed list length =', list.length);
        console.log('[oral] parsed list first 3 =', list.slice(0, 3));

        setPhrases(list);
      } catch (err) {
        console.error('[oral] load error', err);
        if (!mounted) return;
        setError(String(err?.message || err || '加载失败'));
        setPhrases([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
      console.log('[oral] cleanup');
    };
  }, [router.isReady, categoryId, listId]);

  if (!router.isReady) return null;

  if (!categoryData || !listMeta) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>未找到该口语模块</div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>加载中...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#DC2626', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error}
        </div>
      </main>
    );
  }

  return (
    <OralPhraseBrowser
      categoryTitle={categoryData.title}
      title={listMeta.title}
      subtitle={listMeta.subtitle}
      phrases={phrases}
      accent="#2563EB"
      icon="💬"
      onBack={() => router.push(`/oral/${categoryData.id}`)}
      favoriteStorageKey={`oral_favs_${categoryData.id}_${listMeta.id}`}
      settingsStorageKey={`oral_settings_${categoryData.id}_${listMeta.id}`}
      secondaryLabel="缅文"
    />
  );
}

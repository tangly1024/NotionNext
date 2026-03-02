import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

export default function VocabularyIndexPage() {
  return (
    <main style={{ minHeight: '100vh', padding: 16, background: '#f8fafc' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>单词分类</h1>
        <p style={{ color: '#64748b', marginTop: 6 }}>请选择一个分类开始学习</p>

        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {vocabCategories.map((c) => (
            <Link
              key={c.id}
              href={`/vocabulary/${c.id}`}
              style={{
                display: 'block',
                padding: 14,
                borderRadius: 12,
                background: '#fff',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#0f172a',
              }}
            >
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                {c.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

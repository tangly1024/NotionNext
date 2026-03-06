'use client';

import Link from 'next/link';
import Image from 'next/image';
import { memo, useState } from 'react';
import { vocabCategories } from '@/data/vocabData';

const IconChevronRight = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// 原图可用就用原图，不可用就走占位图
const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) {
    return originalCover;
  }
  return `https://picsum.photos/seed/${id}/1200/600`;
};

const getFallbackCover = (id) => `https://picsum.photos/seed/${id}-fallback/1200/600`;

const VocabularyCard = memo(function VocabularyCard({ cat, index }) {
  const [imgSrc, setImgSrc] = useState(getCover(cat.id, cat.cover));
  const itemsCount = Array.isArray(cat.items) ? cat.items.length : 0;

  return (
    <Link
      href={`/vocabulary/${cat.id}`}
      prefetch={false}
      aria-label={`进入 ${cat.title}`}
      className="cardLink"
    >
      <article className="card">
        <Image
          src={imgSrc}
          alt={cat.title}
          fill
          quality={78}
          priority={index < 2}
          sizes="(max-width: 768px) calc(100vw - 32px), 640px"
          className="cover"
          onError={() => {
            const fallback = getFallbackCover(cat.id);
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />

        {/* 沉浸式遮罩 */}
        <div className="overlay" />
        <div className="shine" />

        {/* 内容层 */}
        <div className="content">
          <div className="left">
            <div className="badge">{itemsCount} 个单元</div>

            <h2 className="title">{cat.title}</h2>

            <p className="desc">
              {cat.description || '点击进入该分类，开始沉浸式学习'}
            </p>
          </div>

          <div className="arrowWrap">
            <IconChevronRight size={20} />
          </div>
        </div>
      </article>

      <style jsx>{`
        .cardLink {
          display: block;
          text-decoration: none;
        }

        .card {
          position: relative;
          height: 186px;
          border-radius: 28px;
          overflow: hidden;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
          transform: translateZ(0);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
          isolation: isolate;

          /* 长列表优化：屏幕外内容跳过布局/绘制 */
          content-visibility: auto;
          contain-intrinsic-size: 186px;
        }

        .cover {
          object-fit: cover;
          transform: scale(1.02);
        }

        .overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.06) 0%,
              rgba(0, 0, 0, 0.16) 32%,
              rgba(0, 0, 0, 0.42) 62%,
              rgba(0, 0, 0, 0.82) 100%
            ),
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.12) 0%,
              rgba(59, 130, 246, 0.04) 100%
            );
        }

        .shine {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 82% 16%,
              rgba(255, 255, 255, 0.26) 0%,
              rgba(255, 255, 255, 0.1) 14%,
              rgba(255, 255, 255, 0) 34%
            );
        }

        .content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px;
          padding: 20px;
        }

        .left {
          flex: 1;
          min-width: 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          max-width: 100%;
          padding: 6px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.96);
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.18;
          letter-spacing: -0.4px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);

          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .desc {
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          line-height: 1.45;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .arrowWrap {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 6px 18px rgba(0, 0, 0, 0.16);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .card:active {
          transform: scale(0.985);
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.14);
        }

        @media (hover: hover) {
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
          }
        }
      `}</style>
    </Link>
  );
});

export default function VocabularyIndexPage() {
  if (!vocabCategories?.length) {
    return (
      <main className="page">
        <div className="wrap">
          <div className="empty">暂无词汇分类</div>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background:
              linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
          }

          .wrap {
            max-width: 680px;
            margin: 0 auto;
            padding: 18px 16px 40px;
          }

          .empty {
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            font-size: 15px;
            font-weight: 600;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(226, 232, 240, 0.9);
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="wrap">
        <section className="list" aria-label="词汇分类列表">
          {vocabCategories.map((cat, index) => (
            <VocabularyCard key={cat.id} cat={cat} index={index} />
          ))}
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
          padding-bottom: 84px;
        }

        .wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 18px 16px 40px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .wrap {
            padding-top: 24px;
          }

          .list {
            gap: 18px;
          }
        }
      `}</style>
    </main>
  );
}

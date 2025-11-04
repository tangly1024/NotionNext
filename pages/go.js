'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoPage() {
  const [target, setTarget] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("externalTarget");
    if (saved && /^https?s?:\/\//i.test(saved)) {
      setTarget(saved);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!target) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = target;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (!target) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-semibold mb-4">您即将离开本站</h1>
      <p className="mb-4 text-gray-600">
        即将跳转到：
        <a
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {target}
        </a>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        页面将在 {countdown} 秒后自动跳转。
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => (window.location.href = target)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          立即访问
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </div>
  );
}

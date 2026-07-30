'use client';

import Link from 'next/link';

interface SortTabsProps {
  currentSort: string; // 現在選択されているソート条件
}

export default function SortTabs({ currentSort }: SortTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {/* 投稿の新着順タブ */}
      <Link
        href="/?sort=created"
        className={`pb-2 px-4 text-sm font-medium transition-colors ${
          currentSort !== 'updated'
            ? 'border-b-2 border-blue-500 text-blue-600 font-bold'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        投稿の新着順
      </Link>
      {/* 更新の新着順タブ */}
      <Link
        href="/?sort=updated"
        className={`pb-2 px-4 text-sm font-medium transition-colors ml-4 ${
          currentSort === 'updated'
            ? 'border-b-2 border-blue-500 text-blue-600 font-bold'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        更新の新着順
      </Link>
    </div>
  );
}
import Link from 'next/link';
import PrototypeList from '@/app/components/PrototypeList';
import SearchForm from '@/app/components/SearchForm';
import SortTabs from '@/app/components/SortTabs';
import { findAllPrototypes } from '@/lib/api/prototypes';
import { getCurrentUserServer } from '@/lib/api/users';

// Next.js App Router の Server Component として定義
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  // パラメータを解決し、指定がない場合はデフォルトで 'created' とみなす
  const resolvedParams = await searchParams;
  const sort = resolvedParams.sort || 'created';

  // サーバー側で並行してデータを取得
  const [prototypes, currentUser] = await Promise.all([
    findAllPrototypes(sort).catch((error) => {
      console.error('プロトタイプの取得に失敗しました:', error);
      return [];
    }),
    getCurrentUserServer().catch(() => null),
  ]);

  return (
    <div className="p-8 md:p-16">
      {/* 検索フォーム */}
      <div className="mb-8">
        <SearchForm />
      </div>

      {/* ログインしている場合のみ、マイページへのリンク付き挨拶を表示 */}
      {currentUser && (
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-700 text-lg">
            こんにちは、
            <Link 
              href={`/users/${currentUser.id}`}
              className="underline hover:text-blue-500 transition-colors ml-1"
            >
              {currentUser.name}
            </Link>
            さん
          </p>

          <Link
            href="/bookmarks"
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1.5 px-4 text-sm rounded-full shadow-sm transition-all transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            マイコレクション
          </Link>
        </div>
      )}

      {/* ソート切り替えナビゲーションタブ */}
      <SortTabs currentSort={sort} />

      {/* 作品一覧 */}
      <div className="contents">
        <PrototypeList prototypes={prototypes} />
      </div>
    </div>
  );
}
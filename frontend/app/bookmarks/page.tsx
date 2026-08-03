import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkServerSession } from '@/lib/api/serverAuth';
import { getMyBookmarksServer } from '@/lib/api/bookmarksServer';
import PrototypeList from '@/app/components/PrototypeList';

export default async function BookmarksPage() {
  const isAuthenticated = await checkServerSession();
  
  // 未ログインの場合、サーバー側で直接ブロックし、ログインページへリダイレクト
  if (!isAuthenticated) {
    redirect('/login');
  }

  // バックエンドAPIから、該当ユーザーのマイコレクションデータを取得
  const prototypes = await getMyBookmarksServer();

  return (
    <div className="container mx-auto px-8 md:px-16 py-8">
      <div className="flex items-center gap-3 mb-10 border-b border-gray-200 pb-4">
        <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-yellow-400"
          >
            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          マイコレクション
        </h1>
      </div>

      {/* お気に入りデータが存在する場合、既存のPrototypeListコンポーネントを再利用してグリッド表示 */}
      {prototypes.length > 0 ? (
        <PrototypeList prototypes={prototypes} />
      ) : (
        // データが0件の場合、空状態をレンダリングする
        <div className="text-center py-24 bg-gray-50 rounded-xl border border-gray-200">
          <svg 
            className="w-16 h-16 text-gray-300 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-500 mb-6 text-lg">
            まだお気に入りのプロトタイプがありません。<br />
          </p>
          <Link
            href="/"
            className="inline-block bg-[#7ec8f8] hover:bg-[#6bbcf0] text-white font-bold py-2.5 px-6 rounded transition-colors"
          >
            トップページへ戻る
          </Link>
        </div>
      )}
    </div>
  );
}
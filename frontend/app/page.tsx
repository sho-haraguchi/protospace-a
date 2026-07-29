import Link from 'next/link';
import PrototypeList from '@/app/components/PrototypeList';
import { findAllPrototypes } from '@/lib/api/prototypes';
import { getCurrentUserServer } from '@/lib/api/users'; // ログインユーザーを取得する関数を追加

// async をつけて Server Component にする
export default async function Home() {
  // useEffect や useState を使わず、サーバー側で直接データを取得する
  const [prototypes, currentUser] = await Promise.all([
    findAllPrototypes().catch((error) => {
      console.error('プロトタイプの取得に失敗しました:', error);
      return [];
    }),
    getCurrentUserServer(),
  ]);

  return (
    <div className="p-8 md:p-16">
      {/* ログインしている場合のみ、マイページへのリンク付き挨拶を表示 */}
      {currentUser && (
        <div className="mb-8">
          <p className="text-gray-700 text-lg">
            こんにちは、
            <Link 
              href={`/users/${currentUser.id}`} 
              className="underline hover:text-blue-500 transition-colors ml-1"
            >
              {currentUser.name}さん
            </Link>
          </p>
        </div>
      )}

      {/* 作品一覧 */}
      <div className="contents">
        <PrototypeList prototypes={prototypes} />
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getBookmarkStatus, addBookmark, removeBookmark } from '@/lib/api/bookmarks';

interface BookmarkButtonProps {
  prototypeId: number;
}

export default function BookmarkButton({ prototypeId }: BookmarkButtonProps) {
  const { currentUser } = useAuth(); // ログインユーザー状態を取得
  const router = useRouter();
  
  const [isBookmarked, setIsBookmarked] = useState(false); // 現在お気に入り登録されているか
  const [isLoading, setIsLoading] = useState(true); // 初回APIロード時のローディング状態
  const [isSubmitting, setIsSubmitting] = useState(false); // API送信中の状態（連打防止用のロック）

  // コンポーネントのマウント時、バックエンドに該当作品のお気に入り状態をチェック
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getBookmarkStatus(prototypeId);
        setIsBookmarked(status.isBookmarked);
      } catch (error) {
        console.error('Failed to fetch bookmark status', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [prototypeId, currentUser]);

  // お気に入りボタンがクリックされた時の処理ロジック
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // イベントのバブリングを停止し、ボタンクリック時にカード外側のリンク遷移が発火するのを防ぐ
    
    // 未ログインの場合、処理を中断してログインページへ遷移
    if (!currentUser) {
      alert('マイコレクションを利用するにはログインしてください。');
      router.push('/login');
      return;
    }

    // 初期化中、または送信中の場合は、そのまま return して悪意のある連打をブロック
    if (isLoading || isSubmitting) return;

    setIsSubmitting(true);
    
    // APIの応答を待たずに、UIを瞬時に切り替え（中抜き→塗りつぶし、またはその逆）、UXを向上
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!wasBookmarked); 

    try {
      // 実際にAPIリクエストを送信
      if (wasBookmarked) {
        await removeBookmark(prototypeId);
      } else {
        await addBookmark(prototypeId);
      }
      router.refresh(); // Next.jsのルーターキャッシュをリフレッシュし、一覧などの関連コンポーネントのデータを同期させる
    } catch (error) {
      // ============ 異常時のロールバック ============
      // バックエンドでエラーが発生した場合、先ほど楽観的に更新したUI状態を元の状態に戻し、アラートを表示します
      setIsBookmarked(wasBookmarked); 
      alert('操作に失敗しました。もう一度お試しください。');
      console.error('Bookmark action failed', error);
    } finally {
      // リクエスト完了後、連打防止ロックを解除
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading || isSubmitting}
      // isBookmarkedの状態に応じて、色のスタイルを切り替えます
      className={`flex items-center justify-center p-2 rounded-full transition-all border shadow-sm z-10 ${
        isBookmarked
          ? 'text-yellow-500 bg-yellow-50 border-yellow-300 hover:bg-yellow-100' // 塗りつぶし時の色
          : 'text-gray-400 bg-white border-gray-300 hover:bg-gray-50'            // 中抜き時の色
      }`}
      title={isBookmarked ? 'コレクションから削除' : 'マイコレクションに追加'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isBookmarked ? "currentColor" : "none"} // 状態に応じてSVGの塗りつぶしを切り替え
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 transition-transform active:scale-75"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    </button>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getLikeStatus, addLike, removeLike } from '@/lib/api/likes';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  prototypeId: number;
}

export default function LikeButton({ prototypeId }: LikeButtonProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初期ロード時、サーバーから最新のいいね状態を取得する
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getLikeStatus(prototypeId);
        setIsLiked(status.isLiked);
        setLikeCount(status.likeCount);
      } catch (error) {
        console.error('いいねステータスの取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [prototypeId, currentUser]);

  // いいねボタンがクリックされた時のロジック
  const handleToggleLike = async () => {
    // 未ログインユーザーをブロック
    if (!currentUser) {
      alert('いいねするにはログインが必要です。');
      router.push('/login');
      return;
    }
    // ロード中または通信中ならクリックを無視して連打を防ぐ
    if (isLoading || isSubmitting) return; 

    setIsSubmitting(true); // 通信開始

    // サーバーの応答を待たず、即座にボタンの色と数値を変更する
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      // 裏側で本物のネットワークリクエストを送信する
      if (wasLiked) {
        await removeLike(prototypeId);
      } else {
        await addLike(prototypeId);
      }

      router.refresh();
      
    } catch (error) {
      // ネットワークエラー等で失敗した場合のみ、こっそり状態を元に戻す (ロールバック)
      setIsLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error('いいねの操作に失敗しました', error);
    } finally {
      setIsSubmitting(false); // 成功しても失敗しても通信終了
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading || isSubmitting} // 通信中もボタンを無効化
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all border shadow-sm ${
        isLiked 
          ? 'text-red-500 bg-red-50 border-red-200' 
          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
      }`}
    >
      {/* SVGのハートアイコン。いいね済みの場合は赤く塗りつぶされ、未いいねの場合は中空になります */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 transition-transform active:scale-75"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <span className="font-bold text-sm">{likeCount}</span>
    </button>
  );
}
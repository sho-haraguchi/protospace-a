'use client';

import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  id: number | string;
  className?: string;
}

export default function DeleteButton({ id, className }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('本当にこのプロトタイプを削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/prototypes/${id}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('削除しました');
        router.push('/');
        router.refresh();
      } else if (response.status === 403) {
        // 403 Forbidden の場合に専用メッセージを表示
        alert('自分の投稿以外は削除できません');
      } else if (response.status === 401) {
        // 未ログインの場合（必要に応じて）
        alert('削除するにはログインが必要です');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除処理エラー:', error);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <button onClick={handleDelete} className={className}>
      削除する
    </button>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import { deletePrototype } from '@/lib/api/prototypes';
import axios from 'axios';

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
      await deletePrototype(id);
      alert('削除しました');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('削除処理エラー:', error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 403) {
          alert('自分の投稿以外は削除できません');
          return;
        }
        if (status === 401) {
          alert('削除するにはログインが必要です');
          return;
        }
      }
      alert('削除に失敗しました');
    }
  };

  return (
    <button onClick={handleDelete} className={className}>
      削除する
    </button>
  );
}
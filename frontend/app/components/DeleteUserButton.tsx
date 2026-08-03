'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client'
import styles from '../users/[id]/UserDetail.module.css';

type Props = {
  pageUserId: number;
};

export default function DeleteUserButton({ pageUserId }: Props) {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await apiClient.get('/users/me');
        setCurrentUserId(res.data.id);
      } catch (error) {
        // 未ログインやエラーの場合はスルー
      }
    };
    fetchCurrentUser();
  }, []);

  if (currentUserId !== pageUserId) {
    return null;
  }

  const handleDelete = async () => {
    const isConfirmed = window.confirm('本当に削除しますか？')

    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete('/users');

      alert('アカウントを削除しました。')

      router.push('/');
      router.refresh();

    } catch (error) {
      console.error('削除エラー:', error);
      alert('アカウントの削除に失敗しました')
    }
  };

  return (
    <div className={styles.dangerSection}>
      <button
        onClick={handleDelete}
        className={styles.deleteBtn}>
          アカウントを削除する
      </button>
      <p className={styles.emptyText} style={{ marginBottom: '1rem' }}>※一度削除するともとに戻すことはできません。</p>
    </div>
  );
}
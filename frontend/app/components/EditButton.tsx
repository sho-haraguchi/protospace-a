'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMe } from '@/lib/api/users';
import styles from '@/app/users/[id]/UserDetail.module.css';

interface EditButtonProps {
  pageUserId: number;
}

export default function EditButton({ pageUserId }: EditButtonProps) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        // ログイン中のユーザー情報を取得 (/api/users/me)
        const currentUser = await getMe();
        
        // ログインユーザーのIDと、表示中のページのユーザーIDが一致する場合のみ表示
        if (currentUser && currentUser.id === pageUserId) {
          setIsOwner(true);
        }
      } catch (error: unknown) {
        setIsOwner(false);
      }
    };

    checkCurrentUser();
  }, [pageUserId]);

  // 本人でなければ何も描画（表示）しない
  if (!isOwner) {
    return null;
  }

  return (
    <Link href={`/users/${pageUserId}/edit`} className={styles.editBtn}>
      編集する
    </Link>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import styles from './Header.module.css';

interface User {
  id: number;
  name?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkLoginStatus = async () => {
    try {
      const response = await apiClient.get<User>('/users/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await apiClient.post('/users/logout');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('ログアウト処理に失敗しました', error);
    }
  };

  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink}>
            <img src="/logo.png" alt="PROTO SPACE" width={200} height={37.5} className={styles.logoImg} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 左側：ロゴ */}
        <Link href="/" className={styles.logoLink}>
          <img
            src="/logo.png"
            alt="PROTO SPACE"
            width={200}
            height={37.5}
            className={styles.logoImg}
          />
        </Link>

        {/* 右側：ボタンエリア */}
        <div className={styles.buttonArea}>
          {user ? (
            <>
              <Link href="/prototypes/new" className={styles.btn}>
                New Proto
              </Link>
              <button onClick={handleLogout} className={styles.btn}>
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.btn}>
                ログイン
              </Link>
              <Link href="/signup" className={styles.btn}>
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
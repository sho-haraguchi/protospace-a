'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface User {
  id: number;
  name?: string; 
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkLoginStatus = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // バックエンドのログアウトAPIを呼ぶ
      await fetch('http://localhost:8080/api/users/logout', { method: 'POST' });
    } catch (e) {
      console.error('ログアウト通信エラー:', e);
    } finally {
      // 画面側の状態をクリア
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login'); // ログアウト後はログイン画面に飛ばすのがおすすめ
      router.refresh();
    }
  };

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
              {user.name && <span style={{ marginRight: '15px' }}>こんにちは、{user.name}さん</span>}
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
              {/* 🌟 URLを /register から、今回作った /signup に変更 */}
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
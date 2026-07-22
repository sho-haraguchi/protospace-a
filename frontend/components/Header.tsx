'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './Header.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface User {
  id: number;
  name?: string; 
}

export default function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // クッキー（JSESSIONID）を送信してサーバー側でもセッション破棄するために withCredentials を追加
      await axios.post(`${API_BASE_URL}/api/users/logout`, {}, { withCredentials: true });
    } catch (e) {
      console.error('ログアウト通信エラー:', e);
    } finally {
      // 画面側の状態をクリア
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
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
              {/* URLを /register から、今回作った /signup に変更 */}
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
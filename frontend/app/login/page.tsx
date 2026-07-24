'use client';

import React, { useState } from "react";
import axios from 'axios';
import styles from './login.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      // ユーザー情報を保存
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/';

      // 画面全体をリロードして遷移（ヘッダーの表示を確実に更新させる）
      window.location.href = '/';

    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ログイン</h2>
      {message && <p className={styles.errorMessage}>{message}</p>}
      
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>メールアドレス</label>
          <input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>パスワード</label>
          <input
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          ログイン
        </button>
      </form>
    </div>
  );
}
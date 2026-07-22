'use client';

import React, { useState } from "react";
import axios from 'axios';
import styles from './login.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      // axios ではリクエスト送信とレスポンス取得を1ステップで行える
      // セッションCookie（JSESSIONID）をやり取りするために withCredentials: true を設定
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // ログイン成功時、ユーザー情報をlocalStorageに保存
      // axios の場合、レスポンスデータは response.data に入る
      localStorage.setItem('user', JSON.stringify(response.data));

      // トップページへ遷移
      window.location.href = '/';

    } catch (error: any) {
      console.error(error);

      // ログイン失敗時
      // axios は 400 や 500 系のエラー時に自動的に catch ブロックへ移動
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
'use client';

import React, { useState } from "react";
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // サーバーが空のレスポンス（403など）を返した場合はここを通る
        console.warn('JSONの解析をスキップしました');
      }

      if (response.ok) {
        // ログイン成功時、ユーザー情報をlocalStorageに保存
        localStorage.setItem('user', JSON.stringify(data));

        // トップページへ遷移
        window.location.href = '/';
      } else {
        // ログイン失敗時
       if (data?.message) {
          setMessage(`❌ ${data.message}`);
        } else {
          setMessage('❌ ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ サーバーとの通信に失敗しました。')
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
'use client'

import React, { useState } from 'react';
import { loginUser, LoginParams } from '@/lib/api/users';
import styles from '@/app/login/login.module.css';

interface LoginFormProps {
  onSuccess?: () => void; 
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');

   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const params: LoginParams = { email, password };

      const response = await loginUser(params)

      // ユーザー情報を保持
      localStorage.setItem('user', JSON.stringify(response.data));

      // 成功時のコールバックがあれば実行、なければトップページへリロード
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage(`❌ ログインに失敗しました。メールアドレスまたはパスワードを確認してください。`)
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      {message && <p className={styles.errorMessage}>{message}</p>}

      <div className={styles.inputGroup}>
        <label className={styles.label}>メールアドレス</label>
        <input
          type="email"
          placeholder='example@example.com'
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
  );
}
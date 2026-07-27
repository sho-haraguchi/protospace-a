'use client'

import React, { useState } from 'react';
import axios from 'axios';
import styles from './logun.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

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
      const response =  await axios.post(
        `${API_BASE_URL}/users/Login`,
        { email, password},
        { withCredentials: true}
      );

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
      {message && <p className='{styles.errorMssage'>{message}</p>}

      <div className='{styles.inputGroup'>
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
    </form>
  );
}
'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './signup.module.css';

// 状態管理（State）の定義
export default function SignUpPage() {
  // 入力フォームの各項目の値を保持するためのState
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [position, setPosition] = useState('');

  // 画面に表示する成功・エラーメッセージを保持するState
  const [message, setMessage] = useState('');

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワードとパスワード（確認）は、値の一致が必須であること
    if (password !== passwordConfirmation) {
      setMessage('❌ パスワードが一致しません。');
      return;
    }

    try {
      // バックエンドの新規登録API（Spring Boot）へリクエストを送信
      // axios は第2引数にオブジェクトを渡すだけで自動的に JSON 化して送信します
      await axios.post('http://localhost:8080/api/users', { 
        email, 
        password, 
        passwordConfirmation,
        name,
        profile,
        affiliation,
        position
      });

      // HTTPステータスが200番台（成功）の場合
      setMessage('🎉 登録が完了しました！');

      // 登録完了後、フォームの入力をすべてクリアする
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setName('');
      setProfile('');
      setAffiliation('');
      setPosition('');

    } catch (error: any) {
      // HTTPステータスがエラー（重複エラーやバリデーションエラーなど）またはネットワークエラーの場合
      // axios はエラー発生時に catch へ移動するため、ここでエラーレスポンスを判定します
      console.error(error);

      const data = error.response?.data;

      // バックエンドから返ってきたエラーの形式に合わせてメッセージを抽出
      if (typeof data === 'string') {
        setMessage(`❌ ${data}`);
      } else if (data?.message) {
        setMessage(`❌ ${data.message}`);
      } else if (typeof data === 'object' && data !== null) {
        // 複数のバリデーションエラーがオブジェクトで返ってきた場合、繋げて表示
        const errorMsg = Object.values(data).join(' / ');
        setMessage(`❌ ${errorMsg}`);
      } else {
        setMessage('❌ 登録に失敗しました。');
      }
    }
  };

  // 画面のUI
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザー新規登録</h2>
      
      {message && <p className={styles.errorMessage}>{message}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>メールアドレス</label>
          <input 
            type="email" 
            required 
            autoFocus
            className={styles.inputShort} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>パスワード（6文字以上）</label>
          <input 
            type="password" 
            required 
            minLength={6} 
            className={styles.inputShort} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>パスワード再入力</label>
          <input 
            type="password" 
            required 
            minLength={6} 
            autoComplete="off" 
            className={styles.inputShort} 
            value={passwordConfirmation} 
            onChange={(e) => setPasswordConfirmation(e.target.value)} 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>ユーザー名</label>
          <input 
            type="text" 
            required 
            className={styles.inputShort} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>プロフィール</label>
          <textarea 
            className={styles.textarea} 
            value={profile} 
            onChange={(e) => setProfile(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>所属</label>
          <textarea 
            className={styles.textarea} 
            value={affiliation} 
            onChange={(e) => setAffiliation(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>役職</label>
          <textarea 
            className={styles.textarea} 
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          新規登録
        </button>
      </form>
    </div>
  );
}
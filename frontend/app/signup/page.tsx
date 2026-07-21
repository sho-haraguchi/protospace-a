'use client';

import { useState } from 'react';
import styles from './signup.module.css';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage('❌ パスワードが一致しません。');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          passwordConfirmation,
          name,
          profile,
          affiliation,
          position
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // レスポンス解析エラー対策
      }

      if (response.ok) {
        setMessage('🎉 登録が完了しました！');

        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setName('');
        setProfile('');
        setAffiliation('');
        setPosition('');
      } else {
        if (typeof data === 'string') {
          setMessage(`❌ ${data}`);
        } else if (data?.message) {
          setMessage(`❌ ${data.message}`);
        } else if (typeof data === 'object' && data !== null) {
          const errorMsg = Object.values(data).join(' / ');
          setMessage(`❌ ${errorMsg}`);
        } else {
          setMessage('❌ 登録に失敗しました。');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ サーバーとの通信に失敗しました。');
    }
  };

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
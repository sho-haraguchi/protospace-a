'use client';

import { useState, useEffect } from 'react';
import { getMe, updateUser, UpdateUserParams } from '@/lib/api/users';
import styles from '@/app/signup/signup.module.css';

interface UserEditFormProps {
  onSuccess?: () => void;
}

// プレースホルダー用に元のユーザー情報を保持する型
interface UserPlaceholder {
  name: string;
  profile: string;
  affiliation: string;
  position: string;
}

export default function UserEditForm({ onSuccess }: UserEditFormProps) {
  // 入力フォームの各項目の値を保持するためのState（初期値は空文字）
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [position, setPosition] = useState('');

  // もともとの値を半透明表示（placeholder）するために保持するState
  const [placeholders, setPlaceholders] = useState<UserPlaceholder>({
    name: '',
    profile: '',
    affiliation: '',
    position: '',
  });

  // パスワード変更用
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  // 画面に表示する成功・エラーメッセージを保持するState
  const [message, setMessage] = useState('');

  // 画面初期表示時に現在のユーザー情報を取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe();
        if (data) {
          // 取得した値を placeholder 用の State にセット
          setPlaceholders({
            name: data.name || '',
            profile: data.profile || '',
            affiliation: data.affiliation || '',
            position: data.position || '',
          });
        }
      } catch (error) {
        console.error(error);
        setMessage('❌ ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserData();
  }, []);

  // フォーム送信時の処理（更新処理）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // 新しいパスワードが入力されている場合のバリデーション
    if (newPassword || newPasswordConfirmation) {
      if (!currentPassword) {
        setMessage('❌ パスワードを変更するには「現在のパスワード」を入力してください。');
        return;
      }
      if (newPassword !== newPasswordConfirmation) {
        setMessage('❌ 新しいパスワードと確認用パスワードが一致しません。');
        return;
      }
      if (newPassword.length < 6) {
        setMessage('❌ 新しいパスワードは6文字以上で入力してください。');
        return;
      }
    }

    try {
      // ユーザーが入力しなかった項目（空文字）は元の値（placeholders）を維持
      const payload: UpdateUserParams = {
        name: name !== '' ? name : placeholders.name,
        profile: profile !== '' ? profile : placeholders.profile,
        affiliation: affiliation !== '' ? affiliation : placeholders.affiliation,
        position: position !== '' ? position : placeholders.position,
      };

      if (currentPassword) payload.currentPassword = currentPassword;
      if (newPassword) payload.newPassword = newPassword;
      if (newPasswordConfirmation) payload.newPasswordConfirmation = newPasswordConfirmation;

      const response = await updateUser(payload);

      if (response.status === 200) {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = '/';
        }
      }

    } catch (error: any) {
      console.error(error);

      const data = error.response?.data;

      // バックエンドから返ってきたエラーの形式に合わせてメッセージを抽出
      if (typeof data === 'string') {
        setMessage(`❌ ${data}`);
      } else if (data?.message) {
        setMessage(`❌ ${data.message}`);
      } else if (typeof data === 'object' && data !== null) {
        const errorMsg = Object.values(data).join(' / ');
        setMessage(`❌ ${errorMsg}`);
      } else {
        setMessage('❌ 更新に失敗しました。');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {message && <p className={styles.errorMessage}>{message}</p>}

      <div className={styles.inputGroup}>
        <label className={styles.label}>ユーザー名</label>
        <input 
          type="text" 
          autoFocus
          className={styles.inputShort} 
          value={name} 
          placeholder={placeholders.name}
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>プロフィール</label>
        <textarea 
          className={styles.textarea} 
          value={profile} 
          placeholder={placeholders.profile}
          onChange={(e) => setProfile(e.target.value)}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>所属</label>
        <textarea 
          className={styles.textarea} 
          value={affiliation} 
          placeholder={placeholders.affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>役職</label>
        <textarea 
          className={styles.textarea} 
          value={position} 
          placeholder={placeholders.position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        ※パスワードを変更する場合は以下を入力してください（変更しない場合は空欄のままで構いません）。
      </p>

      <div className={styles.inputGroup}>
        <label className={styles.label}>現在のパスワード</label>
        <input 
          type="password" 
          className={styles.inputShort} 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="パスワード変更時のみ必須"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>新しいパスワード（6文字以上）</label>
        <input 
          type="password" 
          minLength={6} 
          className={styles.inputShort} 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>新しいパスワード（確認用）</label>
        <input 
          type="password" 
          minLength={6} 
          className={styles.inputShort} 
          value={newPasswordConfirmation} 
          onChange={(e) => setNewPasswordConfirmation(e.target.value)} 
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        更新する
      </button>
    </form>
  );
}
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [userId, setUserId] = useState<number | string | null>(null);

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

          setUserId(data.id);

          // 取得した値を placeholder 用の State にセット
          setPlaceholders({
            name: data.name || '',
            profile: data.profile || '',
            affiliation: data.affiliation || '',
            position: data.position || '',
          });

          if (data.image) {
            const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
              ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, '') 
              : 'http://localhost:8080';
            const imageUrl = data.image.startsWith('http') ? data.image : `${BASE_URL}/uploads/prototypes/${data.image}`;
            setPreviewUrl(imageUrl);
          }
        }
      } catch (error) {
        console.error(error);
        setMessage('❌ ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserData();
  }, []);

  // ▼追加: 画像が選択されたときの処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      // プレビュー表示用にURLを生成
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

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
      const formData = new FormData();

      // ユーザーが入力しなかった項目（空文字）は元の値（placeholders）を維持
      formData.append('name', name !== '' ? name : placeholders.name);
      formData.append('profile', profile !== '' ? profile : placeholders.profile);
      formData.append('affiliation', affiliation !== '' ? affiliation : placeholders.affiliation);
      formData.append('position', position !== '' ? position : placeholders.position);

      if (currentPassword) formData.append('currentPassword', currentPassword);
      if (newPassword) formData.append('newPassword', newPassword);
      if (newPasswordConfirmation) formData.append('newPasswordConfirmation', newPasswordConfirmation);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await updateUser(formData);

      if (response.status === 200) {
        if (onSuccess) {
          onSuccess();
        } else if (userId){
          window.location.href = `/users/${userId}`;
        } else {
          window.location.href = `/`;
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
        <label className={styles.label}>プロフィール画像</label>
        {previewUrl && (
          <div className={styles.previewWrapper}>
            <img 
              src={previewUrl} 
              alt="プレビュー" 
              className={styles.previewImage}
            />
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className={styles.fileInput}
        />
      </div>

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

      <hr className={styles.separator} />
      <p className={styles.noticeText}>
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
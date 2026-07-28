'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiClient } from '@/lib/api/client'; 
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import styles from './PrototypeForm.module.css'; 

// 環境変数からベースURLを取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// 画像表示用のベースURLを生成
const ORIGIN_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const IMAGE_BASE_URL = `${ORIGIN_URL}/api/images`;

interface PrototypeFormProps {
  initialData?: {
    name?: string;
    slogan?: string;
    concept?: string;
    image?: string;
  };
  onSubmit?: (formData: FormData) => Promise<void>;
  errorMessages?: string[];
}

const PrototypeForm = ({ 
  initialData, 
  onSubmit: externalOnSubmit, 
  errorMessages: externalErrorMessages = [] 
}: PrototypeFormProps) => {
  const router = useRouter();
  const [internalErrorMessages, setInternalErrorMessages] = useState<string[]>([]);
  // 二重送信防止（ダブルクリック対策）用のState
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 親（編集画面）からエラーメッセージが渡されていればそれを使い、なければ内部のエラーを使う
  const displayErrorMessages = (externalErrorMessages && externalErrorMessages.length > 0)
    ? externalErrorMessages
    : internalErrorMessages;

  const { register, handleSubmit, formState: { errors } } = useForm<PrototypeData>({
    defaultValues: {
      name: initialData?.name || '',
      slogan: initialData?.slogan || '',
      concept: initialData?.concept || '',
    }
  });

  const handleFormSubmit = async (data: PrototypeData) => {
    // すでに送信中なら何もしない（連打ガード）
    if (isSubmitting) return;

    // 送信開始：フラグを立ててボタンを無効化
    setIsSubmitting(true);
    setInternalErrorMessages([]);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slogan', data.slogan);
    formData.append('concept', data.concept);

    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      // ① 編集時 (PUT) の処理を先に実行
      if (externalOnSubmit) {
        await externalOnSubmit(formData);
        return;
      }

      // ② 新規投稿時 (POST) の処理
      await apiClient.post('/prototypes', formData);
      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      console.error('投稿エラー:', error);

      // AxiosError かどうかの型ガードを追加して安全に参照する
      if (axios.isAxiosError(error)) {
        // 投稿セッションが切れていた場合のリダイレクト
        if (error.response?.status === 401) {
          router.replace('/login');
          return;
        }

        if (error.response?.data?.messages) {
          setInternalErrorMessages(error.response.data.messages);
        } else if (error.response?.data?.message) {
          setInternalErrorMessages([error.response.data.message]);
        } else {
          setInternalErrorMessages(['投稿の保存に失敗しました。']);
        }
      } else {
        setInternalErrorMessages(['予期せぬエラーが発生しました。']);
      }
    } finally {
      // 処理完了（成功・失敗問わず）時に送信中フラグを解除
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles['form-container']}>
      {/* エラーメッセージ表示エリア */}
      {displayErrorMessages.length > 0 && (
        <div className={styles['error-messages-box']}>
          {displayErrorMessages.map((error, index) => (
            <p key={index} className={styles['error-text']}>{error}</p>
          ))}
        </div>
      )}

      {/* プロトタイプの名称 */}
      <div className={styles.field}>
        <label className={styles['field-label']}>プロトタイプの名称</label>
        <input
          type="text"
          className={`${styles['input-text']} ${styles['input-short']}`}
          {...register('name', { required: 'プロトタイプの名称を入力してください' })}
        />
        {errors.name && <p className={styles['error-text']}>{errors.name.message}</p>}
      </div>

      {/* キャッチコピー */}
      <div className={styles.field}>
        <label className={styles['field-label']}>キャッチコピー</label>
        <textarea
          rows={2}
          className={`${styles['input-text']} ${styles['input-textarea']}`}
          {...register('slogan', { required: 'キャッチコピーを入力してください' })}
        />
        {errors.slogan && <p className={styles['error-text']}>{errors.slogan.message}</p>}
      </div>

      {/* コンセプト */}
      <div className={styles.field}>
        <label className={styles['field-label']}>コンセプト</label>
        <textarea
          rows={3}
          className={`${styles['input-text']} ${styles['input-textarea']}`}
          {...register('concept', { required: 'コンセプトを入力してください' })}
        />
        {errors.concept && <p className={styles['error-text']}>{errors.concept.message}</p>}
      </div>

      {/* プロトタイプの画像 */}
      <div className={styles.field}>
        <label className={styles['field-label']}>プロトタイプの画像</label>
        
        {initialData?.image && (
          <div className="mb-3">
            <p className="text-sm text-gray-500 mb-1">現在の登録画像：</p>
            <img
              src={
                initialData.image.startsWith('http')
                  ? initialData.image
                  : `${IMAGE_BASE_URL}/${initialData.image}`
              }
              alt="現在の画像"
              className="w-48 h-auto object-cover border border-gray-300 rounded"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className={styles['input-file']}
          {...register('image', { 
             required: initialData ? false : '画像を選択してください' 
          })}
        />
        {errors.image && <p className={styles['error-text']}>{errors.image.message}</p>}
      </div>

      {/* 保存するボタン */}
      <div className={styles.actions}>
        <button 
          type="submit" 
          className={styles['submit-btn']}
          disabled={isSubmitting} // 送信中はクリック不可
        >
          {isSubmitting ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
};

export default PrototypeForm;
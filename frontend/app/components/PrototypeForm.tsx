'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiClient } from '@/lib/api/client'; 
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import styles from './PrototypeForm.module.css'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

interface PrototypeFormProps {
  initialData?: {
    id?: number;
    name?: string;
    slogan?: string;
    concept?: string;
    image?: string;
  };
  onSubmit?: (formData: FormData) => Promise<void>;
  errorMessages?: string[];
}

// 各項目の文字数制限
const LIMITS = {
  NAME: 50,
  SLOGAN: 100,
  CONCEPT: 200,
};

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

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<PrototypeData>({
    defaultValues: {
      name: initialData?.name || '',
      slogan: initialData?.slogan || '',
      concept: initialData?.concept || '',
    }
  });

  // 入力値を監視
  const nameValue = watch('name') || '';
  const sloganValue = watch('slogan') || '';
  const conceptValue = watch('concept') || '';

  // 残り文字数の計算
  const nameRemaining = LIMITS.NAME - nameValue.length;
  const sloganRemaining = LIMITS.SLOGAN - sloganValue.length;
  const conceptRemaining = LIMITS.CONCEPT - conceptValue.length;

  // 超過判定
  const isNameOver = nameRemaining < 0;
  const isSloganOver = sloganRemaining < 0;
  const isConceptOver = conceptRemaining < 0;
  const isAnyOver = isNameOver || isSloganOver || isConceptOver;

  const handleFormSubmit = async (data: PrototypeData) => {
    // 1. 二重送信ガード（すでに送信中なら中断）
    if (isSubmitting) return;

    // 2. 文字数制限ガード（上限オーバーなら中断）
    if (isAnyOver) return;

    // 3. 送信開始：フラグを立ててボタンを無効化し、エラー表示をクリア
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
        {isNameOver && (
          <span className={styles['char-count-over']}>
            {nameRemaining} （上限 {LIMITS.NAME} 文字）
          </span>
        )}
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
        {isSloganOver && (
          <span className={styles['char-count-over']}>
            {sloganRemaining} （上限 {LIMITS.SLOGAN} 文字）
          </span>
        )}
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
        {isConceptOver && (
          <span className={styles['char-count-over']}>
            {conceptRemaining} （上限 {LIMITS.CONCEPT} 文字）
          </span>
        )}
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
          disabled={isSubmitting || isAnyOver}
        >
          {isSubmitting ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
};

export default PrototypeForm;
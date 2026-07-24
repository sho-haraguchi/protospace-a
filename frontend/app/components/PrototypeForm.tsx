'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api/client'; 
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import styles from './PrototypeForm.module.css'; 

interface PrototypeFormProps {
  initialData?: {
    name?: string;
    slogan?: string;
    concept?: string;
  };
}

const PrototypeForm = ({ initialData }: PrototypeFormProps) => {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<PrototypeData>({
    defaultValues: {
      name: initialData?.name || '',
      slogan: initialData?.slogan || '',
      concept: initialData?.concept || '',
    }
  });

const handleFormSubmit = async (data: PrototypeData) => {
  setErrorMessages([]);

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slogan', data.slogan);
  formData.append('concept', data.concept);

  if (data.image && data.image[0]) {
    formData.append('image', data.image[0]);
  }

  try {
    // ヘッダーの明示指定を外し、apiClientに任せる
    await apiClient.post('/prototypes', formData);

    // 投稿成功時
    router.push('/');
    router.refresh();
  } catch (error: any) {
    console.error('投稿エラー:', error);

    if (error.response?.data?.messages) {
      setErrorMessages(error.response.data.messages);
    } else if (error.response?.data?.message) {
      setErrorMessages([error.response.data.message]);
    } else {
      setErrorMessages(['投稿の保存に失敗しました。']);
    }
  }
};
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles['form-container']}>
      
      {/* エラーメッセージ表示エリア */}
      {errorMessages.length > 0 && (
        <div className={styles['error-messages-box']}>
          {errorMessages.map((error, index) => (
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
        <input
          type="file"
          accept="image/*"
          className={styles['input-file']}
          {...register('image', { required: '画像を選択してください' })}
        />
        {errors.image && <p className={styles['error-text']}>{errors.image.message}</p>}
      </div>

      {/* 保存するボタン */}
      <div className={styles.actions}>
        <button type="submit" className={styles['submit-btn']}>
          保存する
        </button>
      </div>
    </form>
  );
};

export default PrototypeForm;
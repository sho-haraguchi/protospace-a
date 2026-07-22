'use client';

import { useForm } from 'react-hook-form';
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import styles from './PrototypeForm.module.css'; 

interface PrototypeListProps {
  prototypes: PrototypeData[];
}

interface PrototypeFormProps {
  initialData?: {
    name?: string;
    slogan?: string;
    concept?: string;
  };
  errorMessages: string[];
  onSubmit: (formData: FormData) => void;
}

const PrototypeForm = ({ errorMessages, onSubmit, initialData }: PrototypeFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PrototypeData>({
    defaultValues: {
      name: initialData?.name || '',
      slogan: initialData?.slogan || '',
      concept: initialData?.concept || '',
    }
  });

  const handleFormSubmit = (data: PrototypeData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slogan', data.slogan);
    formData.append('concept', data.concept);

    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    onSubmit(formData);
  };

  return (
    // ★2. styles['form-container'] のように指定
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
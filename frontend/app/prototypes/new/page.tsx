'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css'; 

const CreatePrototypePage = () => {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessages([]);

    try {
      const response = await fetch('http://localhost:8080/app/prototypes', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const errorData = await response.json();
        if (errorData.messages) {
          setErrorMessages(errorData.messages);
        } else {
          setErrorMessages(['投稿の保存に失敗しました。']);
        }
      }
    } catch (error) {
      console.error('通信エラー:', error);
      setErrorMessages(['サーバーとの通信に失敗しました。']);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>新規プロトタイプ投稿</h2>
      <PrototypeForm
        errorMessages={errorMessages}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePrototypePage;
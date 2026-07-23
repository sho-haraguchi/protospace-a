'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css'; 

const CreatePrototypePage = () => {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessages([]);

    try {
      await axios.post("http://localhost:8080/api/prototypes", formData, {
        withCredentials: true, // セッション(Cookie)を送信（fetchのcredentials: 'include'に相当）
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("通信エラー:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        // バックエンドからバリデーションエラーなどが返ってきた場合
        const errorData = error.response.data;
        if (errorData.messages) {
          setErrorMessages(errorData.messages);
        } else {
          setErrorMessages(["投稿の保存に失敗しました。"]);
        }
      } else {
        // サーバーが落ちているなどの致命的なエラー
        setErrorMessages(["サーバーとの通信に失敗しました。"]);
      }
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
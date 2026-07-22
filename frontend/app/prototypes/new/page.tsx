'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PrototypeForm from '@/app/components/PrototypeForm';

// 初期入力データ用の型（画像は空文字などで初期化）
interface PrototypeInitialData {
  name: string;
  slogan: string;
  concept: string;
  image: string;
}

const CreatePrototypePage = () => {
  const router = useRouter();
  
  // 1. 変数名を initialData に変更して FormData とのバッティングを回避！
  const initialData: PrototypeInitialData = { name: '', slogan: '', concept: '', image: '' };
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // 2. 引数を PrototypeForm から送られてくる FormData 型で受け取る
  const handleSubmit = async (formData: FormData) => {
    setErrorMessages([]);

    try {
      const response = await fetch('http://localhost:8080/app/prototypes', {
        method: 'POST',
        credentials: 'include',
        body: formData, // ★ フォームから渡された FormData が正しくセットされます
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
    <>
      <div className="contents row">
        <div className="container">
          <h3>投稿する</h3>
          <PrototypeForm
            initialData={initialData}
            errorMessages={errorMessages}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePrototypePage;
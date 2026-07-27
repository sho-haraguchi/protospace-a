'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrototypeForm from '@/app/components/PrototypeForm';
import { updatePrototype } from '@/lib/api/prototypes';

interface PrototypeEditFormProps {
  id: string;
  initialData: {
    name: string;
    slogan: string;
    concept: string;
    image?: string;
  };
}

export default function PrototypeEditForm({ id, initialData }: PrototypeEditFormProps) {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // フォーム送信時の処理（API更新リクエスト）
  const handleSubmit = async (formData: FormData) => {
    setErrorMessages([]);
    try {
      await updatePrototype(id, formData);

      // リクエスト成功時は詳細ページへ遷移して画面を更新
      router.push(`/prototypes/${id}`);
      router.refresh();

    } catch (error: any) {
      console.error('通信エラー:', error);
      if (error.response?.data?.messages) {
        setErrorMessages(error.response.data.messages);
      } else {
        setErrorMessages(['更新に失敗しました。']);
      }
    }
  };

  return (
    <PrototypeForm
      initialData={initialData}
      errorMessages={errorMessages}
      onSubmit={handleSubmit}
    />
  );
}
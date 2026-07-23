'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css';
import { getPrototypeDetail } from '@/lib/api/prototypes';
import { apiClient } from '@/lib/api/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPrototypePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  // バックエンドから取得した既存データを格納するState
  const [initialData, setInitialData] = useState<{name: string, slogan: string, concept: string} | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // ログイン状態の確認
        const userResponse = await apiClient.get('/users/me');
        const currentUser = userResponse.data;

        // 現在のプロトタイプの詳細情報を取得
        const prototype = await getPrototypeDetail(id);
        if (!prototype) {
          router.push('/');
          return;
        }

        // 投稿者本人でなければトップページへ遷移
        if (currentUser.id !== prototype.user.id) {
          router.push('/');
          return;
        }

        // 取得した旧データをStateに保存し、コンポーネントへ渡す準備をする
        setInitialData({
          name: prototype.name,
          slogan: prototype.slogan,
          concept: prototype.concept,
        });

      } catch (error) {
        // 未ログインの場合はログインページへ遷移
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessages([]);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/prototypes/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      // リクエスト成功の場合、詳細ページへ戻る
      router.push(`/prototypes/${id}`);
      router.refresh();

    } catch (error: any) {
      console.error('通信エラー:', error);
      if (error.response && error.response.data && error.response.data.messages) {
        setErrorMessages(error.response.data.messages);
      } else {
        setErrorMessages(['更新に失敗しました。']);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>プロトタイプ編集</h2>
      {initialData && (
        <PrototypeForm
          initialData={initialData}
          errorMessages={errorMessages}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
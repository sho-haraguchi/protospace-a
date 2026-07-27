'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrototypeList from '@/app/components/PrototypeList';
import SearchForm from '@/app/components/SearchForm';
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import { findAllPrototypes } from '@/app/api/prototypes';

export default function Home() {
  const router = useRouter();
  const [prototypes, setPrototypes] = useState<PrototypeData[]>([]); 

  useEffect(() => {
    const getPrototypes = async () => {
      try {
        const response = await findAllPrototypes();
        setPrototypes(response);
      } catch (error) {
        console.error('プロトタイプの取得に失敗しました:', error);
      }
    };
    getPrototypes();
  }, []);

  // 検索フォームから呼び出される遷移処理
  const handleSearch = (query: string) => {
    router.push(`/prototypes/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-8 md:p-16">
      {/* 検索フォームの追加 */}
      <div className="mb-8">
        <SearchForm onSearch={handleSearch} initialQuery="" />
      </div>

      <div className="contents">
        <PrototypeList prototypes={prototypes} />
      </div>
    </div>
  );
}
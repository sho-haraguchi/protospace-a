'use client';

import { useEffect, useState } from 'react';
import PrototypeList from '@/app/components/PrototypeList';
import { PrototypeData } from '@/app/interfaces/PrototypeData';
import { findAllPrototypes } from '@/app/api/prototypes';

export default function Home() {
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

  return (
    <div className="p-8 md:p-16">
      <div className="contents">
        <PrototypeList prototypes={prototypes} />
      </div>
    </div>
  );
}
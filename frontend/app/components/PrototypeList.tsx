'use client';

import { PrototypeData } from '@/app/interfaces/PrototypeData';
import PrototypeCard from '@/app/components/PrototypeCard';

interface PrototypeListProps {
  prototypes: PrototypeData[];
}

const PrototypeList = ({ prototypes }: PrototypeListProps) => {
  return (
    // レスポンシブ設定
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* 取得したデータの配列をmap関数でループさせ、1つずつカードコンポーネントを作る*/}
      {prototypes.map((proto) => (
        <PrototypeCard key={proto.id} prototype={proto} />
      ))}
    </div>
  );
};

export default PrototypeList;
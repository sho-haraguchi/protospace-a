'use client';

import Link from 'next/link';
import { PrototypeData } from '@/app/interfaces/PrototypeData';

interface PrototypeCardProps {
  prototype: PrototypeData;
}

const PrototypeCard = ({ prototype }: PrototypeCardProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* 画像エリア */}
      <div className="w-full aspect-square bg-[#A5DCE0] mb-4 overflow-hidden relative">
        <img 
          src={`http://localhost:8080/api/images/${prototype.image}`} 
          alt={prototype.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      {/* プロトタイプ名 */}
      <h2 className="text-xl font-bold mb-2">{prototype.name}</h2>
      {/* キャッチコピー */}
      <p className="text-gray-600 mb-4 text-sm flex-grow">{prototype.slogan}</p>
      {/* 投稿者名 */}
      <div className="text-right text-sm text-gray-400 mt-auto">
        <Link href={`/user/${prototype.user?.id}`} className="hover:underline">
          by {prototype.user?.name}
        </Link>
      </div>
    </div>
  );
};

export default PrototypeCard;
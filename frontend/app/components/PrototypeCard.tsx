'use client';

import Link from 'next/link';
import { PrototypeData } from '@/app/interfaces/PrototypeData';

const IMAGE_BASE_URL = 'http://localhost:8080/uploads/prototypes';

interface PrototypeCardProps {
  prototype: PrototypeData;
}

const PrototypeCard = ({ prototype }: PrototypeCardProps) => {

  const targetUserId = prototype.user?.id ?? (prototype as any).userId;

  const imageUrl = prototype.image
    ? prototype.image.startsWith('http')
      ? prototype.image
      : `${IMAGE_BASE_URL}/${prototype.image}`
    : 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="flex flex-col h-full">
      {/* 画像エリア */}
      <div className="w-full aspect-square bg-[#A5DCE0] mb-4 overflow-hidden relative">
        <img 
          src={imageUrl} 
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
        {targetUserId ? (
          <Link href={`/users/${targetUserId}`} className="hover:underline">
            by {prototype.user?.name || '名無し'}
          </Link>
        ) : (
          <span>by {prototype.user?.name || '名無し'}</span>
        )}
      </div>
    </div>
  );
};

export default PrototypeCard;
'use client';

import Link from 'next/link';
import { PrototypeData } from '@/app/interfaces/PrototypeData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

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
      <Link 
        href={`/prototypes/${prototype.id}`} 
        className="w-full aspect-square bg-[#A5DCE0] mb-4 overflow-hidden relative block hover:opacity-80 transition-opacity"
      >
        <img 
          src={imageUrl} 
          alt={prototype.name} 
          className="w-full h-full object-cover" 
        />
      </Link> 

      {/* プロトタイプ名 */}
      <Link href={`/prototypes/${prototype.id}`} className="hover:underline">
        <h2 className="text-xl font-bold mb-2">{prototype.name}</h2>
      </Link>

      {/* キャッチコピー */}
      <p className="text-gray-600 mb-4 text-sm flex-grow">{prototype.slogan}</p>
      
      {/* 下部エリアを左右に分ける */}
      <div className="mt-auto flex justify-between items-end px-4 pb-4"></div>

      {/* いいね数の表示 */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-400">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span className="font-medium">{prototype.likeCount || 0}</span>
        </div>

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
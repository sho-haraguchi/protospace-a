'use client';

import { useState, useCallback } from 'react';
import { CommentData } from '@/app/interfaces/CommentData';
import { getComments, createComment } from '@/lib/api/comments';

export const useComments = (
  prototypeId: number,
  initialComments: CommentData[] = []
) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // コメント一覧の再取得
  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(prototypeId);
      setComments(data);
    } catch (error) {
      console.error('コメントの取得に失敗しました', error);
    }
  }, [prototypeId]);

  // コメント投稿処理
  const submitComment = async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment(prototypeId, { text });
      setText('');
      await fetchComments();
    } catch (error) {
      console.error('コメントの送信に失敗しました', error);
    } finally {
      setIsSubmitting(false);
    }
  }; // ← submitComment 関数の終わり

  return {
    comments,
    text,
    setText,
    submitComment,
    isSubmitting,
  };
}; // ← useComments 関数の終わり
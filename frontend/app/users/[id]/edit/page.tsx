'use client';

import React, { use } from 'react';
import UserEditForm from '@/app/components/UserEditForm';
import styles from '@/app/signup/signup.module.css';

export default function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Client Component で Next.js の Promise 形式 params を解凍する正しい書き方
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザー情報編集</h2>
      <UserEditForm />
    </div>
  );
}
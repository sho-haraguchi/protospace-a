'use client';

import SignupForm from '@/app/components/SignupForm';
import styles from './signup.module.css';

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザー新規登録</h2>
      <SignupForm />
    </div>
  );
}
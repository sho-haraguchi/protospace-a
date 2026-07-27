import { redirect } from 'next/navigation';
import { checkServerSession } from '@/lib/api/serverAuth';
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css';

const CreatePrototypePage = async () => {
  const isAuthenticated = await checkServerSession();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>新規プロトタイプ投稿</h2>
      <PrototypeForm />
    </div>
  );
};

export default CreatePrototypePage;
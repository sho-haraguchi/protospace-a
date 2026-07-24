import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css';

const CreatePrototypePage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>新規プロトタイプ投稿</h2>
      <PrototypeForm />
    </div>
  );
};

export default CreatePrototypePage;
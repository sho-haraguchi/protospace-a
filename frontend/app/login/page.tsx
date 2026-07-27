import LoginForm from '@/app/components/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ログイン</h2>
      <LoginForm />
    </div>
  );
}
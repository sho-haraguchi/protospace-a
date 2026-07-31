"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  initialQuery?: string; 
}

const SearchForm = ({ initialQuery = '' }: SearchFormProps) => {
  const router = useRouter(); // 追加
  const { register, handleSubmit } = useForm<{ searchText: string }>({
    defaultValues: { searchText: initialQuery }
  });

  const onSubmit = (data: { searchText: string }) => {
    const trimmedText = data.searchText ? data.searchText.trim() : '';

    if (!trimmedText) {
      return;
    }

    router.push(`/prototypes/search?query=${encodeURIComponent(trimmedText)}`);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register('searchText')}
        placeholder="プロトタイプを検索する"
        className={styles.searchInput}
      />
      <input
        type="submit"
        className={styles.searchBtn}
        value="検索"
      />
    </form>
  );
};

export default SearchForm;
import SearchForm from '@/app/components/SearchForm';
import PrototypeList from '@/app/components/PrototypeList';
import { searchPrototypes } from '@/lib/api/prototypes';

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query = '' } = await searchParams;
  const prototypes = query ? await searchPrototypes(query) : [];

  return (
    <div className="p-8 md:p-16">
      <div className="mb-8">
        <SearchForm initialQuery={query} />
      </div>

      {query && (
        <h1 className="text-xl font-bold mb-6 text-gray-800">
          「{query}」の検索結果（{prototypes.length}件）
        </h1>
      )}

      {prototypes.length > 0 ? (
        <div className="contents">
          <PrototypeList prototypes={prototypes} />
        </div>
      ) : (
        <p className="text-gray-500">該当するプロトタイプは見つかりませんでした。</p>
      )}
    </div>
  );
};

export default SearchPage;
import { searchPrototypes } from '@/lib/api/prototypes';
import PrototypeList from '@/app/components/PrototypeList';
import { PrototypeData } from '@/app/interfaces/PrototypeData'; 
import SearchForm from '@/app/components/SearchForm';

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.query || '';

  let prototypes: PrototypeData[] = [];

  if (query) {
    try {
      prototypes = await searchPrototypes(query);
    } catch (error) {
      console.error('検索エラー:', error);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchForm initialQuery={query} />
      </div>
      <h1 className="text-2xl font-bold mb-6">
        「{query}」の検索結果（{prototypes.length}件）
      </h1>

      {prototypes.length > 0 ? (
        <PrototypeList prototypes={prototypes} />
      ) : (
        <p className="text-gray-500">該当するプロトタイプは見つかりませんでした。</p>
      )}
    </main>
  );
}
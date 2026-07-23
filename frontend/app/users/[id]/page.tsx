import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";

type User = {
  id: number;
  name: string;
  profile: string;
  affiliation: string;
  position: string;
};

type Prototype = {
  id: number;
  title: string;
  catch_copy: string;
  concept: string;
};

type UserDetailResponse = {
  user: User;
  prototypes: Prototype[];
};

async function getUserDetail(id: string): Promise<UserDetailResponse | null> {
  try {
    const res = await axios.get<UserDetailResponse>('http://localhost:8080/api/users/${id}');
    return res.data;
  } catch (error) {
    // 404エラーの場合、nullを返し、notFound()に繋ぐ
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    // その他エラー
    throw new Error("データの取得に失敗しました");
  }
}

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const data = await getUserDetail(params.id);

  if (!data) {
    notFound();
  }

  const { user, prototypes } = data;

  return (
    <main className="max-w-5xl mx-auto p-8 pt-12">
      {/* ユーザー情報セクション */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">{user.name}さんの情報</h2>
        <table className="w-full border-collapse border border-gray-200 bg-white">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 w-48 bg-gray-50 text-left text-gray-700 font-bold border-r border-gray-200">
                名前
              </th>
              <td className="py-4 px-6 text-gray-700">{user.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 bg-gray-50 text-left text-gray-700 font-bold border-r border-gray-200">
                プロフィール
              </th>
              <td className="py-4 px-6 text-gray-700 whitespace-pre-wrap">{user.profile}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 bg-gray-50 text-left text-gray-700 font-bold border-r border-gray-200">
                所属
              </th>
              <td className="py-4 px-6 text-gray-700">{user.affiliation}</td>
            </tr>
            <tr>
              <th className="py-4 px-6 bg-gray-50 text-left text-gray-700 font-bold border-r border-gray-200">
                役職
              </th>
              <td className="py-4 px-6 text-gray-700">{user.position}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* プロトタイプ一覧セクション */}
      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-6">{user.name}さんのプロトタイプ</h2>
        
        {prototypes.length === 0 ? (
          <p className="text-gray-500">まだプロトタイプを投稿していません。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {prototypes.map((prototype) => (
              <div key={prototype.id} className="flex flex-col">
                <Link href={`/prototypes/${prototype.id}`}>
                  <div className="bg-[#a8dcd9] aspect-square mb-3 flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                     <span className="text-white font-bold">Image</span>
                  </div>
                </Link>
                
                <h3 className="font-bold text-lg text-gray-800 mb-1">{prototype.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{prototype.catch_copy}</p>
                
                <div className="text-right mt-auto">
                  <Link href={`/users/${user.id}`} className="text-xs text-gray-400 hover:underline">
                    by {user.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
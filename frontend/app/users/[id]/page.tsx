import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserDetail, UserDetailResponse } from "@/lib/api/users";
import styles from "./UserDetail.module.css";
import EditButton from "@/app/components/EditButton";
import DeleteUserButton from "@/app/components/DeleteUserButton";

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
  ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, '') 
  : 'http://localhost:8080';
const IMAGE_BASE_URL = `${BASE_URL}/uploads/prototypes`;

// アバター用URL整形
function resolveAvatarUrl(imagePath: string | null | undefined): string {
  if (!imagePath || imagePath.includes("localhost")) {
    return "https://placehold.co/400x400?text=No+Image";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${IMAGE_BASE_URL}/${cleanPath}`;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const data: UserDetailResponse | null = await getUserDetail(id);

  if (!data || !data.user) {
    notFound();
  }

  const { user, prototypes } = data;

  const avatarUrl = resolveAvatarUrl(user.image);

  return (
    <main className={styles.container}>
      {/* ユーザー情報 */}
      <section className={styles.section}>
        <div className={styles.headerGroup}>
          <div className={styles.headerProfile}>
            <div className={styles.avatarWrapper}>
              <img
                src={avatarUrl}
                alt={`${user.name}のアバター`}
                className={styles.avatarImage}
              />
            </div>
            <h2 className={styles.heading}>{user.name}さんの情報</h2>
          </div>
          <EditButton pageUserId={user.id} />
        </div>

        <table className={styles.table}>
          <tbody>
            <tr className={styles.tableRow}>
              <th className={styles.tableHeader}>名前</th>
              <td className={styles.tableData}>{user.name}</td>
            </tr>
            <tr className={styles.tableRow}>
              <th className={styles.tableHeader}>プロフィール</th>
              <td className={styles.tableData}>{user.profile}</td>
            </tr>
            <tr className={styles.tableRow}>
              <th className={styles.tableHeader}>所属</th>
              <td className={styles.tableData}>{user.affiliation}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>役職</th>
              <td className={styles.tableData}>{user.position}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* プロトタイプ一覧 */}
      <section>
        <h2 className={styles.heading}>{user.name}さんのプロトタイプ</h2>

        {!prototypes || prototypes.length === 0 ? (
          <p className={styles.emptyText}>まだプロトタイプを投稿していません。</p>
        ) : (
          <div className={styles.grid}>
            {prototypes.map((prototype) => (
              <div key={prototype.id} className={styles.card}>
                <Link href={`/prototypes/${prototype.id}`}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={
                        !prototype.image
                          ? "https://placehold.co/600x400?text=No+Image"
                          : prototype.image.startsWith("http")
                          ? prototype.image
                          : `${IMAGE_BASE_URL}/${prototype.image}`
                      }
                      alt={prototype.name}
                      className={styles.image}
                    />
                  </div>
                </Link>

                <h3 className={styles.cardTitle}>{prototype.name}</h3>
                <p className={styles.cardSlogan}>{prototype.slogan}</p>

                <div className={styles.authorWrapper}>
                  <Link
                    href={`/users/${user.id}`}
                    className={styles.authorLink}
                  >
                    by {user.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <DeleteUserButton pageUserId={user.id} />
    </main>
  );
}
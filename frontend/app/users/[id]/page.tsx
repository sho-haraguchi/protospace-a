import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserDetail, UserDetailResponse } from "@/lib/api/users";
import styles from "./UserDetail.module.css";
import EditButton from "@/app/components/EditButton";
import DeleteUserButton from "@/app/components/DeleteUserButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

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

  return (
    <main className={styles.container}>
      {/* ユーザー情報セクション */}
      <section className={styles.section}>
       <div className={styles.headerGroup}>
        <h2 className={styles.heading}>{user.name}さんの情報</h2>
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

      {/* プロトタイプ一覧セクション */}
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
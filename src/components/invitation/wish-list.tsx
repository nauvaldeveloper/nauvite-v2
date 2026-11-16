import { getPublicWishes } from "@/lib/invitation/public";

export type WishListClasses = Partial<Record<"list" | "item" | "name" | "date" | "message" | "empty", string>>;

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

/** Daftar ucapan tamu (server component, data di-cache per undangan). */
export async function WishList({ slug, cls = {} }: { slug: string; cls?: WishListClasses }) {
  const wishes = await getPublicWishes(slug);

  if (wishes.length === 0) {
    return <p className={cls.empty}>Belum ada ucapan. Jadilah yang pertama.</p>;
  }

  return (
    <ul className={cls.list}>
      {wishes.map((w) => (
        <li key={w.id} className={cls.item}>
          <p className={cls.name}>{w.name}</p>
          <p className={cls.message}>{w.message}</p>
          <p className={cls.date}>{dateFmt.format(new Date(w.createdAt))}</p>
        </li>
      ))}
    </ul>
  );
}

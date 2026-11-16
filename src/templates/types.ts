import type { PublicInvitation } from "@/lib/invitation/public";

/** Props yang diterima setiap komponen tampilan template. */
export type TemplateProps = {
  invitation: PublicInvitation;
  /** Nama tamu dari ?to=, sudah dibersihkan. null kalau tidak ada. */
  guestName: string | null;
};

import type { Role } from "@/lib/auth/dal";
import type { NavItem } from "./nav";

/** Menu panel untuk setiap peran. */
export function navFor(role: Role): { title: string; items: NavItem[] } {
  if (role === "admin") {
    return {
      title: "Panel admin",
      items: [
        { href: "/admin", label: "Beranda", icon: "home", exact: true },
        { href: "/admin/undangan", label: "Undangan", icon: "list" },
        { href: "/admin/buat", label: "Buat", icon: "plus" },
        { href: "/admin/mitra", label: "Mitra", icon: "users" },
        { href: "/admin/cetak", label: "Cetak", icon: "print" },
        { href: "/admin/ulasan", label: "Ulasan", icon: "star" },
        { href: "/admin/pengaturan", label: "Pengaturan", icon: "settings" },
      ],
    };
  }
  if (role === "partner") {
    return { title: "Mitra", items: [{ href: "/mitra/dasbor", label: "Undangan klien", icon: "list" }] };
  }
  return { title: "Dasbor", items: [{ href: "/dasbor", label: "Undangan saya", icon: "home" }] };
}

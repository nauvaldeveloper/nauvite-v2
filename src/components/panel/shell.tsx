import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { IconLogout } from "@/components/invitation/icons";
import { signOut } from "@/lib/auth/actions";
import { SideNav, TabBar, type NavItem } from "./nav";

/**
 * Kerangka panel. Layar lebar: menu samping hijau tinta. HP: bilah atas
 * ringkas + menu tab di bawah, terasa seperti aplikasi.
 */
export function PanelShell({
  title,
  nav,
  userLabel,
  children,
}: {
  title: string;
  nav: NavItem[];
  userLabel: string;
  children: ReactNode;
}) {
  const initial = userLabel.trim().charAt(0).toUpperCase() || "N";
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-ink px-4 py-6 text-[#f3eee5] lg:flex">
        <Link href={nav[0]?.href ?? "/"} className="mb-8 px-3">
          <Logo size={34} textClassName="text-[#f3eee5]" />
          <span className="mt-2 block pl-[46px] text-[12px] font-medium text-[#9aa79f]">{title}</span>
        </Link>
        <SideNav items={nav} />
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-display text-[15px] font-semibold text-ink">
              {initial}
            </span>
            <span className="min-w-0 truncate text-[13px] text-[#d8d2c4]">{userLabel}</span>
          </div>
          <form action={signOut} className="mt-3">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#d8d2c4] hover:bg-white/[0.06] hover:text-white">
              <IconLogout className="text-[18px]" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-[#f3eee5]/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href={nav[0]?.href ?? "/"} className="flex items-center gap-2">
            <Logo tone="gelap" size={28} textClassName="text-[21px]" />
            <span className="text-[12px] font-medium text-muted">{title}</span>
          </Link>
          <form action={signOut}>
            <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted hover:bg-ink/5">
              <IconLogout /> Keluar
            </button>
          </form>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10">{children}</main>
      </div>

      <TabBar items={nav} />
    </div>
  );
}

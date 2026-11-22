"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconEnvelope,
  IconHome,
  IconPlus,
  IconSettings,
  IconStar,
  IconUsers,
} from "@/components/invitation/icons";

const ICONS = {
  home: IconHome,
  list: IconCalendar,
  plus: IconPlus,
  users: IconUsers,
  settings: IconSettings,
  star: IconStar,
  print: IconEnvelope,
};

export type NavIcon = keyof typeof ICONS;
export type NavItem = { href: string; label: string; icon: NavIcon; exact?: boolean };

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Menu samping (layar lebar). */
export function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
              active ? "bg-[#f3eee5] text-ink" : "text-[#d8d2c4] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Icon className="text-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Menu tab di bawah layar (HP). */
export function TabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // Satu menu saja (dasbor klien) tidak perlu bilah tab.
  if (items.length < 2) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-md justify-around px-2">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                active ? "text-gold" : "text-[#9aa79f]"
              }`}
            >
              <Icon className="text-[20px]" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

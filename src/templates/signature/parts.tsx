"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOpening } from "@/components/invitation/opening";
import {
  IconCalendar,
  IconChat,
  IconEnvelope,
  IconGift,
  IconHeart,
  IconHome,
  IconImage,
  IconPause,
  IconPlay,
} from "@/components/invitation/icons";
import s from "./template.module.css";

/** Sampul berbentuk lengkung dengan foto berbingkai dan tombol buka. */
export function Cover({ children }: { children: ReactNode }) {
  const { opened, open } = useOpening();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const id = setTimeout(() => setGone(true), 1000);
    return () => clearTimeout(id);
  }, [opened]);

  if (gone) return null;

  return (
    <section className={s.cover} data-opened={opened} aria-hidden={opened}>
      <div className={s.coverCard}>
        {children}
        <button type="button" className={s.primaryButton} onClick={open} disabled={opened}>
          <IconEnvelope /> Buka Undangan
        </button>
      </div>
    </section>
  );
}

export function MusicButton() {
  const { opened, playing, toggleMusic, hasMusic } = useOpening();
  if (!opened || !hasMusic) return null;
  return (
    <button
      type="button"
      className={s.musicButton}
      onClick={toggleMusic}
      aria-label={playing ? "Matikan musik" : "Putar musik"}
      data-playing={playing}
    >
      {playing ? <IconPause /> : <IconPlay />}
    </button>
  );
}

const NAV_ICONS = {
  home: IconHome,
  couple: IconHeart,
  events: IconCalendar,
  gallery: IconImage,
  gifts: IconGift,
  wishes: IconChat,
};

export type NavItem = { id: string; label: string; icon: keyof typeof NAV_ICONS };

/** Navigasi bawah untuk lompat antarbagian, muncul setelah undangan dibuka. */
export function BottomNav({ items }: { items: NavItem[] }) {
  const { opened } = useOpening();
  if (!opened) return null;
  return (
    <nav className={s.bottomNav} aria-label="Bagian undangan">
      {items.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        return (
          <a key={item.id} href={`#${item.id}`} className={s.navItem}>
            <Icon />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

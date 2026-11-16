"use client";

import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Perilaku umum semua template: undangan tertutup sampul dulu, halaman tidak
 * bisa di-scroll, lalu saat tamu menekan "Buka undangan" sampul hilang dan
 * musik mulai diputar (browser hanya mengizinkan musik setelah ada klik).
 */

type OpeningState = {
  opened: boolean;
  open: () => void;
  playing: boolean;
  toggleMusic: () => void;
  hasMusic: boolean;
};

const OpeningContext = createContext<OpeningState | null>(null);

export function useOpening() {
  const ctx = use(OpeningContext);
  if (!ctx) throw new Error("useOpening harus dipakai di dalam <OpeningProvider>");
  return ctx;
}

export function OpeningProvider({ music, children }: { music?: string; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!opened) {
      root.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [opened]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    play();
  }, [play]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else {
      audio.pause();
      setPlaying(false);
    }
  }, [play]);

  // Jeda musik saat tamu pindah tab, lanjutkan saat kembali.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !opened) return;
      if (document.hidden) audio.pause();
      else if (playing) audio.play().catch(() => setPlaying(false));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [opened, playing]);

  return (
    <OpeningContext value={{ opened, open, playing, toggleMusic, hasMusic: !!music }}>
      {music ? <audio ref={audioRef} src={music} loop preload="none" /> : null}
      {children}
    </OpeningContext>
  );
}

"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Menandai elemen dengan data-visible="true" saat masuk layar, supaya CSS
 * template bisa memberi animasi muncul yang lembut. Animasi diputar ulang
 * setiap kali elemen masuk layar lagi. Tanpa JavaScript, elemen tetap tampil
 * (CSS template hanya menyembunyikan saat [data-visible="false"]).
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.visible = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

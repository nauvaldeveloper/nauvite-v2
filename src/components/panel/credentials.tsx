"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

/**
 * Menampilkan username + password baru SATU KALI setelah dibuat, dengan tombol
 * salin dan kirim lewat WhatsApp. Password tidak disimpan di mana pun selain di
 * Supabase Auth (dalam bentuk acak/hash), jadi tidak bisa dilihat lagi nanti.
 */
export function CredentialsCard({
  login,
  password,
  whatsapp,
  slug,
  title = "Akun login sudah dibuat",
}: {
  login: string;
  password: string;
  whatsapp?: string | null;
  slug?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const message = [
    "Halo, akun Nauvite kamu sudah siap.",
    "",
    ...(slug ? [`Link undangan: ${site}/${slug}`] : []),
    `Masuk ke dasbor: ${site}/masuk`,
    `Username: ${login}`,
    `Password: ${password}`,
    "",
    "Simpan pesan ini baik-baik ya.",
  ].join("\n");

  const waUrl = `https://wa.me/${whatsapp ?? ""}?text=${encodeURIComponent(message)}`;

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">
        Password hanya tampil sekali ini. Kirim ke klien sekarang, setelah halaman ditutup password tidak bisa
        dilihat lagi (tapi bisa dibuat ulang).
      </p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-white/70 p-3 font-mono text-sm">
        <dt className="text-emerald-800">Username</dt>
        <dd className="select-all">{login}</dd>
        <dt className="text-emerald-800">Password</dt>
        <dd className="select-all">{password}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-lg bg-[#1f3a2e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2a4b3c]"
        >
          Kirim lewat WhatsApp
        </a>
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? "Tersalin" : "Salin pesan"}
        </Button>
      </div>
    </div>
  );
}

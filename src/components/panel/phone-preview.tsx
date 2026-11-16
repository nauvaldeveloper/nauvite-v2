"use client";

import { useState } from "react";

/**
 * Undangan ditampilkan hidup di dalam bingkai HP. Isinya halaman /pratinjau,
 * jadi undangan draf pun bisa dilihat pengelolanya.
 */
export function PhonePreview({ invitationId, guestName }: { invitationId: string; guestName?: string }) {
  const [key, setKey] = useState(0);
  const src = `/pratinjau/${invitationId}${guestName ? `?to=${encodeURIComponent(guestName)}` : ""}`;
  // Layar HP asli 390x844, diperkecil supaya muat di panel.
  const scale = 0.72;

  return (
    <div className="grid justify-items-center gap-3">
      <div className="rounded-[46px] bg-ink p-[10px] shadow-[0_30px_60px_-25px_rgb(23_38_31/0.55)]">
        <div
          className="relative overflow-hidden rounded-[36px] bg-black"
          style={{ width: 390 * scale, height: 844 * scale }}
        >
          <iframe
            key={key}
            src={src}
            title="Pratinjau undangan"
            className="origin-top-left border-0"
            style={{ width: 390, height: 844, transform: `scale(${scale})` }}
          />
          <span className="pointer-events-none absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
      <div className="flex gap-2 text-[13px] font-semibold">
        <button type="button" onClick={() => setKey((k) => k + 1)} className="rounded-full px-3 py-1.5 text-muted hover:bg-ink/5">
          Muat ulang
        </button>
        <a href={src} target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 text-muted hover:bg-ink/5">
          Buka layar penuh
        </a>
      </div>
    </div>
  );
}

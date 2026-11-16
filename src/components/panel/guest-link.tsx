"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

/** Membuat link undangan dengan nama tamu (?to=), siap disalin atau dikirim lewat WA. */
export function GuestLinkTool({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const clean = name.replace(/\s+/g, " ").trim();
  const link = `${site}/${slug}${clean ? `?to=${encodeURIComponent(clean).replace(/%20/g, "+")}` : ""}`;
  const message = `Kepada Yth.\n${clean || "Bapak/Ibu/Saudara/i"}\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami. Info lengkap ada di link berikut:\n${link}\n\nMerupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu. Terima kasih.`;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tamu, mis. Bapak Rudi" />
      <p className="break-all rounded-lg bg-[#f6f5f1] px-3 py-2 font-mono text-[13px]">{link}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? "Tersalin" : "Salin link"}
        </Button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-medium hover:bg-black/[0.03]"
        >
          Kirim lewat WhatsApp
        </a>
      </div>
    </div>
  );
}
